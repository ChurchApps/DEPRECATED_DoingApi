import "reflect-metadata";
import dotenv from "dotenv";
import { Environment } from "../src/helpers/Environment";
import { Pool, DBCreator } from "@churchapps/apihelper";

const init = async () => {
  dotenv.config();
  await Environment.init(process.env.APP_ENV?.toString() || "");
  console.log("Connecting");
  Pool.initPool();

  const taskTables: { title: string, file: string }[] = [
    { title: "Actions", file: "actions.mysql" },
    { title: "Automations", file: "automations.mysql" },
    { title: "Tasks", file: "tasks.mysql" },
    { title: "Conditions", file: "conditions.mysql" }
  ]

  const schedulingTables: { title: string, file: string }[] = [
    { title: "Assignments", file: "assignments.mysql" },
    { title: "Blockout Dates", file: "blockoutDates.mysql" },
    { title: "Notes", file: "notes.mysql" },
    { title: "Plans", file: "plans.mysql" },
    { title: "PlanItems", file: "planItems.mysql" },
    { title: "Positions", file: "positions.mysql" },
    { title: "Times", file: "times.mysql" }
  ]

  await initTables("Tasks", taskTables);
  await initTables("Scheduling", schedulingTables);
};


const initTables = async (displayName: string, tables: { title: string, file: string }[]) => {
  console.log("");
  console.log("SECTION: " + displayName);
  for (const table of tables) await DBCreator.runScript(table.title, "./tools/dbScripts/" + table.file, false);
}

init()
  .then(() => { console.log("Database Created"); process.exit(0); })
  .catch((ex) => {
    console.log(ex);
    console.log("Database not created due to errors");
    process.exit(0);
  });
