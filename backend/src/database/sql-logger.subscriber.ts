import { EventSubscriber, type EntitySubscriberInterface } from 'typeorm';
import type { AfterQueryEvent } from 'typeorm/subscriber/event/QueryEvent';

@EventSubscriber()
export class SqlLoggerSubscriber implements EntitySubscriberInterface {
    afterQuery(event: AfterQueryEvent): void {
        const { query, inline } = formatSql(interpolateParameters(event.query, event.parameters));
        const executionTime = event.executionTime ?? 0;

        console.log(
            `${COLOR.magenta}query:${COLOR.reset}${inline ? ' ' : '\n'}${query}${inline ? '  ' : '\n'}${COLOR.gray}(${executionTime} ms)${COLOR.reset}`,
        );

        if (!event.success && event.error) {
            console.error(event.error);
        }
    }
}

function interpolateParameters(query: string, parameters?: unknown[] | object): string {
    const values = Array.isArray(parameters) ? parameters : [];
    let parameterIndex = 0;
    let quote: "'" | '"' | null = null;
    let result = '';

    for (let index = 0; index < query.length; index++) {
        const character = query[index];
        const nextCharacter = query[index + 1];

        if (quote) {
            result += character;

            if (character === '\\') {
                result += nextCharacter ?? '';
                index++;
            } else if (character === quote) {
                quote = null;
            }

            continue;
        }

        if (character === "'" || character === '"') {
            quote = character;
            result += character;
        } else if (character === '`') {
            // Bỏ quote identifier của MySQL ở phần log, không tác động query thực thi.
        } else if (character === '?' && parameterIndex < values.length) {
            result += formatValue(values[parameterIndex++]);
        } else {
            result += character;
        }
    }

    return result;
}

function formatValue(value: unknown): string {
    if (value === null || value === undefined) {
        return 'NULL';
    }

    if (typeof value === 'number' || typeof value === 'bigint') {
        return String(value);
    }

    if (typeof value === 'boolean') {
        return value ? 'TRUE' : 'FALSE';
    }

    if (value instanceof Date) {
        return quoteValue(value.toISOString());
    }

    if (Buffer.isBuffer(value)) {
        return `X'${value.toString('hex')}'`;
    }

    if (Array.isArray(value)) {
        return value.map(formatValue).join(', ');
    }

    if (typeof value === 'object') {
        return quoteValue(JSON.stringify(value));
    }

    return quoteValue(String(value));
}

function quoteValue(value: string): string {
    return `'${value.replaceAll("'", "''")}'`;
}

const COLOR = {
    cyan: '\x1b[1;36m',
    magenta: '\x1b[1;35m',
    gray: '\x1b[90m',
    reset: '\x1b[0m',
};

const CLAUSE_PATTERN =
    /^(LEFT\s+(?:OUTER\s+)?JOIN|RIGHT\s+(?:OUTER\s+)?JOIN|FULL\s+(?:OUTER\s+)?JOIN|INNER\s+JOIN|CROSS\s+JOIN|GROUP\s+BY|ORDER\s+BY|UNION\s+ALL|INSERT\s+INTO|DELETE\s+FROM|SELECT|UPDATE|FROM|WHERE|HAVING|LIMIT|OFFSET|VALUES|SET|JOIN|ON|UNION)\b/i;

function formatSql(query: string): { query: string; inline: boolean } {
    const strings: string[] = [];
    const maskedQuery = query.replace(/'(?:''|\\.|[^'])*'|"(?:""|\\.|[^"])*"/g, (value) => {
        strings.push(value);
        return `\u0000${strings.length - 1}\u0000`;
    });
    const normalizedQuery = shortenEntityAliases(maskedQuery.replace(/\s+/g, ' ').trim());
    const inline = splitClauses(normalizedQuery).length <= 2 && !/\(\s*SELECT\b/i.test(normalizedQuery);

    const formattedQuery = (inline ? normalizedQuery : formatLevel(normalizedQuery, 0)).replace(
        /\b(SELECT|FROM|WHERE|LEFT(?: OUTER)? JOIN|RIGHT(?: OUTER)? JOIN|FULL(?: OUTER)? JOIN|INNER JOIN|CROSS JOIN|JOIN|ON|AND|OR|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|VALUES|SET|UNION(?: ALL)?|INSERT INTO|UPDATE|DELETE FROM|START TRANSACTION|COMMIT|ROLLBACK)\b/gi,
        `${COLOR.cyan}$1${COLOR.reset}`,
    );

    return {
        query: formattedQuery.replace(/\u0000(\d+)\u0000/g, (_, index: string) => strings[Number(index)]),
        inline,
    };
}

function shortenEntityAliases(query: string): string {
    const aliases = Array.from(query.matchAll(/\b([A-Z][A-Za-z0-9]*Entity)(?=[._\s,)]|$)/g), ([, alias]) => alias);
    const aliasMap = new Map<string, string>();

    for (const alias of aliases) {
        aliasMap.set(alias, toShortAlias(alias));
    }

    for (const [alias, shortAlias] of aliasMap) {
        query = query.replace(new RegExp(`${escapeRegExp(alias)}(?=[._\\s,)]|$)`, 'g'), shortAlias);
    }

    return query;
}

function toShortAlias(alias: string): string {
    const name = alias.replace(/Entity$/, '');
    const letters = name.match(/[A-Z]/g);

    return (letters?.join('') || name[0]).toLowerCase();
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function formatLevel(query: string, indent: number): string {
    const clauses = splitClauses(query);

    if (clauses.length === 0) {
        return `${' '.repeat(indent)}${formatSubqueries(query, indent)}`;
    }

    const lines: string[] = [];

    for (let index = 0; index < clauses.length; index++) {
        const clause = clauses[index];
        const nextClause = clauses[index + 1];

        if (isJoinKeyword(clause.keyword) && nextClause?.keyword.toUpperCase() === 'ON') {
            lines.push(formatJoinWithOn(clause.keyword, clause.content, nextClause.content, indent));
            index++;
            continue;
        }

        lines.push(formatClause(clause.keyword, clause.content, indent));
    }

    return lines.filter(Boolean).join('\n');
}

function formatClause(keyword: string, content: string, indent: number): string {
    const padding = ' '.repeat(indent);
    const normalizedKeyword = keyword.toUpperCase().replace(/\s+/g, ' ');

    if (normalizedKeyword === 'SELECT') {
        const columns = splitTopLevel(content, ',');
        const lines: string[] = [];

        for (let index = 0; index < columns.length; index += 4) {
            const columnsInLine = columns.slice(index, index + 4).map((column) => formatSubqueries(column, indent + 7));
            const hasMoreColumns = index + 4 < columns.length;
            lines.push(`${index === 0 ? `${padding}SELECT ` : `${padding}       `}${columnsInLine.join(', ')}${hasMoreColumns ? ',' : ''}`);
        }

        return lines.join('\n');
    }

    if (normalizedKeyword === 'WHERE' || normalizedKeyword === 'HAVING' || normalizedKeyword === 'ON') {
        return formatConditions(normalizedKeyword, content, indent, `${padding}${normalizedKeyword} `, `${padding}    `);
    }

    return `${padding}${normalizedKeyword}${content ? ` ${formatSubqueries(content, indent)}` : ''}`;
}

function formatJoinWithOn(joinKeyword: string, joinContent: string, onContent: string, indent: number): string {
    const padding = ' '.repeat(indent);
    const normalizedJoinKeyword = joinKeyword.toUpperCase().replace(/\s+/g, ' ');
    const joinPrefix = `${padding}${normalizedJoinKeyword}${joinContent ? ` ${formatSubqueries(joinContent, indent)}` : ''} ON `;

    return formatConditions('ON', onContent, indent, joinPrefix, `${padding}    `);
}

function formatConditions(
    keyword: string,
    content: string,
    indent: number,
    firstLinePrefix: string,
    nextLinePrefix: string,
): string {
    const conditions = splitConditions(content);
    const lines: string[] = [];

    for (let index = 0; index < conditions.length; index += 3) {
        const conditionsInLine = conditions.slice(index, index + 3);
        const line = conditionsInLine
            .map(({ operator, expression }, conditionIndex) => {
                const formattedExpression = formatSubqueries(removeWrappingParentheses(expression), indent + 4);
                return index === 0 && conditionIndex === 0 ? formattedExpression : `${operator} ${formattedExpression}`;
            })
            .join(' ');

        lines.push(`${index === 0 ? firstLinePrefix : nextLinePrefix}${line}`);
    }

    return lines.join('\n');
}

function isJoinKeyword(keyword: string): boolean {
    return /^(LEFT\s+(?:OUTER\s+)?JOIN|RIGHT\s+(?:OUTER\s+)?JOIN|FULL\s+(?:OUTER\s+)?JOIN|INNER\s+JOIN|CROSS\s+JOIN|JOIN)$/i.test(keyword);
}

function splitClauses(query: string): Array<{ keyword: string; content: string }> {
    const clauses: Array<{ keyword: string; content: string }> = [];
    let depth = 0;
    let currentKeyword = '';
    let contentStart = 0;

    for (let index = 0; index < query.length; index++) {
        if (query[index] === '(') {
            depth++;
            continue;
        }

        if (query[index] === ')') {
            depth--;
            continue;
        }

        if (depth !== 0 || (index > 0 && /[\w]/.test(query[index - 1]))) {
            continue;
        }

        const match = query.slice(index).match(CLAUSE_PATTERN);
        if (!match) {
            continue;
        }

        if (currentKeyword) {
            clauses.push({ keyword: currentKeyword, content: query.slice(contentStart, index).trim() });
        }

        currentKeyword = match[1];
        index += match[1].length - 1;
        contentStart = index + 1;
    }

    if (currentKeyword) {
        clauses.push({ keyword: currentKeyword, content: query.slice(contentStart).trim() });
    }

    return clauses;
}

function splitTopLevel(value: string, separator: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let partStart = 0;

    for (let index = 0; index < value.length; index++) {
        if (value[index] === '(') depth++;
        if (value[index] === ')') depth--;

        if (depth === 0 && value[index] === separator) {
            parts.push(value.slice(partStart, index).trim());
            partStart = index + 1;
        }
    }

    parts.push(value.slice(partStart).trim());
    return parts.filter(Boolean);
}

function splitConditions(value: string): Array<{ operator: string; expression: string }> {
    const conditions: Array<{ operator: string; expression: string }> = [];
    const logicalOperator = /^(AND|OR)\b/i;
    let operator = '';
    let expressionStart = 0;
    let depth = 0;
    let betweenPending = false;

    for (let index = 0; index < value.length; index++) {
        if (value[index] === '(') depth++;
        if (value[index] === ')') depth--;
        if (depth !== 0 || (index > 0 && /[\w]/.test(value[index - 1]))) continue;

        if (/^BETWEEN\b/i.test(value.slice(index))) {
            betweenPending = true;
            continue;
        }

        const match = value.slice(index).match(logicalOperator);
        if (!match) continue;

        if (betweenPending && match[1].toUpperCase() === 'AND') {
            betweenPending = false;
            continue;
        }

        conditions.push({ operator, expression: value.slice(expressionStart, index).trim() });
        operator = match[1].toUpperCase();
        index += match[1].length - 1;
        expressionStart = index + 1;
    }

    conditions.push({ operator, expression: value.slice(expressionStart).trim() });
    return conditions.filter(({ expression }) => expression);
}

function removeWrappingParentheses(value: string): string {
    let result = value.trim();

    while (result.startsWith('(') && result.endsWith(')') && findClosingParenthesis(result, 0) === result.length - 1) {
        result = result.slice(1, -1).trim();
    }

    return result;
}

function formatSubqueries(value: string, indent: number): string {
    let result = '';

    for (let index = 0; index < value.length; index++) {
        if (value[index] !== '(') {
            result += value[index];
            continue;
        }

        const closingIndex = findClosingParenthesis(value, index);
        if (closingIndex === -1) {
            result += value[index];
            continue;
        }

        const inner = value.slice(index + 1, closingIndex).trim();
        if (/^SELECT\b/i.test(inner)) {
            result += `(\n${formatLevel(inner, indent + 4)}\n${' '.repeat(indent)})`;
        } else {
            result += `(${formatSubqueries(inner, indent)})`;
        }

        index = closingIndex;
    }

    return result.trim();
}

function findClosingParenthesis(value: string, openingIndex: number): number {
    let depth = 0;

    for (let index = openingIndex; index < value.length; index++) {
        if (value[index] === '(') depth++;
        if (value[index] === ')') depth--;
        if (depth === 0) return index;
    }

    return -1;
}
