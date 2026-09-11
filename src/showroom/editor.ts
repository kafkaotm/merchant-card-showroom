import type { FieldSchema } from "../core/field-schema";

// Schema-driven form: one input per field, type mapped to an appropriate
// input type, pre-filled with the current value. onChange fires with the
// value already coerced to the field's declared type (number fields never
// hand the caller a string), so callers can merge it straight into their
// data without re-parsing.
export function renderEditor<T extends object>(
  container: HTMLElement,
  schema: FieldSchema[],
  value: T,
  onChange: (key: string, newValue: string | number) => void,
): void {
  const values = value as Record<string, unknown>;

  container.replaceChildren(
    ...schema.map((field) => {
      const label = document.createElement("label");
      label.textContent = `${field.label} `;

      const input = document.createElement("input");
      input.type = field.type === "number" ? "number" : "text";
      input.value = String(values[field.key] ?? "");
      input.addEventListener("input", () => {
        onChange(field.key, field.type === "number" ? Number(input.value) : input.value);
      });

      label.append(input);
      return label;
    }),
  );
}
