// Minimal schema-driven-form vocabulary: enough field types to cover the
// Product shape today (string, number). Not designed ahead of need for
// enum/boolean/image — add those when a real card schema needs one.
export interface FieldSchema {
  key: string;
  label: string;
  type: "string" | "number";
}
