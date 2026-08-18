const token = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN;
const baseId = process.env.AIRTABLE_BASE_ID;
const tableName = process.env.AIRTABLE_TABLE_NAME || "Leads";

if (!token || !baseId) {
  console.error("Missing AIRTABLE_PERSONAL_ACCESS_TOKEN or AIRTABLE_BASE_ID.");
  process.exit(1);
}

const endpoint = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};
const testId = `connection-test-${Date.now()}`;
let recordId;

async function reportTableSchema() {
  const response = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
    headers,
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    console.warn("SCHEMA WARNING: add schema.bases:read to the token to list field names.");
    return null;
  }
  const body = await response.json();
  const table = body.tables?.find((item) => item.name === tableName || item.id === tableName);
  if (!table) {
    console.warn(`SCHEMA WARNING: table "${tableName}" was not found in the base schema.`);
    return null;
  }
  const fieldNames = table.fields.map((field) => field.name);
  console.log(`FIELDS: ${fieldNames.join(", ")}`);
  return fieldNames;
}

async function airtableRequest(url, options) {
  const response = await fetch(url, { ...options, headers, signal: AbortSignal.timeout(15_000) });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const details = body?.error?.message || body?.error?.type || JSON.stringify(body);
    throw new Error(`Airtable ${options.method} failed (${response.status}): ${details}`);
  }
  return body;
}

try {
  console.log(`Testing Airtable table "${tableName}" in base ${baseId.slice(0, 7)}...`);
  const fieldNames = await reportTableSchema();
  if (fieldNames) {
    const expectedFields = ["Lead ID", "Name", "Email", "Phone", "Service", "Status", "Summary"];
    const missingFields = expectedFields.filter((field) => !fieldNames.includes(field));
    if (missingFields.length) throw new Error(`SCHEMA FAILED: missing fields: ${missingFields.join(", ")}`);
  }
  const created = await airtableRequest(endpoint, {
    method: "PATCH",
    body: JSON.stringify({
      performUpsert: { fieldsToMergeOn: ["Lead ID"] },
      records: [{
        fields: {
          "Lead ID": testId,
          Name: "SalonVault Connection Test",
          Email: "connection-test@notifications.salonvault.online",
          Phone: "+1 555 010 9999",
          Service: "Other",
          Status: "Needs review",
          Summary: "Temporary record created by scripts/test-airtable-connection.mjs",
        },
      }],
      typecast: true,
    }),
  });

  recordId = created.records?.[0]?.id;
  if (!recordId) throw new Error("Airtable accepted the request but returned no record ID.");
  console.log(`WRITE OK: temporary record ${recordId} was created.`);

  try {
    await airtableRequest(`${endpoint}/${recordId}`, { method: "GET" });
    console.log("READ OK: the temporary record was retrieved.");
  } catch (error) {
    console.warn(`READ WARNING: ${error.message}`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  if (recordId) {
    try {
      await airtableRequest(`${endpoint}/${recordId}`, { method: "DELETE" });
      console.log("CLEANUP OK: the temporary record was deleted.");
    } catch (error) {
      console.error(`CLEANUP FAILED for ${recordId}: ${error instanceof Error ? error.message : error}`);
      process.exitCode = 1;
    }
  }
}
