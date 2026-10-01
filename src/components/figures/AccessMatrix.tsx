import React from 'react';

/*
  Who can do what with which record, spelled out in words so nothing needs a
  legend. A real grid of text, so it reads well with a screen reader too.
*/

export type Access = 'writes' | 'reads' | 'approves' | 'audits' | 'none';

export type MatrixRow = { record: string; access: Access[]; emphasis?: boolean };

export default function AccessMatrix({ roles, rows, caption }: { roles: string[]; rows: MatrixRow[]; caption: string }) {
  return (
    <table className="w-full table-fixed border-separate border-spacing-y-2.5 text-left">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr>
          <th scope="col" className="w-[30%]" />
          {roles.map((role) => (
            <th key={role} scope="col" className="text-center font-mono text-xs font-normal text-ink-3">
              {role}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.record}>
            <th scope="row" className={`pr-3 text-sm font-medium ${row.emphasis ? 'text-accent-ink' : 'text-ink'}`}>
              {row.record}
            </th>
            {row.access.map((level, i) => (
              <td key={roles[i]} className="text-center">
                {level === 'none' ? (
                  <span className="text-rule-strong" aria-label="no access">
                    —
                  </span>
                ) : (
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs ${
                      level === 'writes' ? 'bg-accent/12 text-accent-ink' : 'bg-paper text-ink-2'
                    }`}
                  >
                    {level}
                  </span>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
