// import { createClient } from "@supabase/supabase-js";
// import fs from "fs";

// const supabase = createClient(
//   "https://ywqiofxwkvqpqpeullhm.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3cWlvZnh3a3ZxcHFwZXVsbGhtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjgxNTkwNiwiZXhwIjoyMDk4MzkxOTA2fQ.rikBKrDGIqvhrqDgcxaf0ZP9EkL3GrgC1ovUA0cb97E"
// );

// const users = JSON.parse(
//   fs.readFileSync("users.json", "utf8")
// );

// async function run() {
//   for (const user of users) {
//     const { error } =
//       await supabase.auth.admin.createUser({
//         email: user.email,
//         password_hash: user.encrypted_password,
//         email_confirm: true,
//         id: user.id,
//         user_metadata: user.raw_user_meta_data
//       });

//     if (error) {
//       console.log("❌", user.email, error.message);
//     } else {
//       console.log("✅", user.email);
//     }
//   }
// }

// run();            


import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const supabase = createClient(
  "https://ywqiofxwkvqpqpeullhm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3cWlvZnh3a3ZxcHFwZXVsbGhtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjgxNTkwNiwiZXhwIjoyMDk4MzkxOTA2fQ.rikBKrDGIqvhrqDgcxaf0ZP9EkL3GrgC1ovUA0cb97E"


);

const users = JSON.parse(
  fs.readFileSync("users.json", "utf8")
);

async function run() {
  for (const user of users) {
    const { data, error } =
      await supabase.auth.admin.createUser({
        email: user.email,
        password: "Temp@123456",   // <-- password_hash ki jagah ye use karo
        email_confirm: true,
        user_metadata: user.raw_user_meta_data
      });

    if (error) {
      console.error("❌", user.email, error);
    } else {
      console.log("✅", user.email, data);
    }
  }
}

run();
