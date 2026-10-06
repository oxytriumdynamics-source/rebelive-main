const fs = require("fs");
const lines = fs.readFileSync("C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\57c4df5e-e67d-45ec-81cc-f4a273965977\\.system_generated\\logs\\transcript.jsonl", "utf8").split("\n");
for (const line of lines) {
  if (line.includes('"step_index":156')) {
    const data = JSON.parse(line);
    fs.writeFileSync("d:\\Dinestx\\Rebelive\\frontend\\scratch_step156.json", JSON.stringify(data.tool_calls[0].args, null, 2));
    console.log("Found and wrote step 156!");
    break;
  }
}
