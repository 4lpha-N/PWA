/**
 * setRole.mjs – Rollenanträge verwalten (genehmigen / ablehnen)
 *
 * Voraussetzungen:
 *   1. firebase-admin installieren (einmalig):
 *        npm install firebase-admin --save-dev
 *
 *   2. Service Account Key herunterladen:
 *        Firebase Console → Projekteinstellungen → Dienstkonten
 *        → "Neuen privaten Schlüssel generieren" → als scripts/serviceAccountKey.json speichern
 *        ⚠️  NIEMALS committen! Ist bereits in .gitignore eingetragen.
 *
 * Verwendung:
 *   node scripts/setRole.mjs approve <uid>          ← Antrag genehmigen (setzt role=contributor)
 *   node scripts/setRole.mjs reject  <uid>          ← Antrag ablehnen  (kein Claim, Status=rejected)
 *   node scripts/setRole.mjs revoke  <uid>          ← Rechte entziehen
 *   node scripts/setRole.mjs set     <uid> <rolle>  ← Rolle direkt setzen (z. B. admin)
 *
 * Nach approve/revoke/set muss sich der Nutzer neu einloggen damit das Token aktualisiert wird.
 */

import admin from "firebase-admin";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const serviceAccount = require("./serviceAccountKey.json");

const [, , command, uid, roleArg] = process.argv;

const ALLOWED_COMMANDS = ["approve", "reject", "revoke", "set"];

if (
  !command ||
  !uid ||
  !ALLOWED_COMMANDS.includes(command) ||
  (command === "set" && !roleArg)
) {
  console.error("Verwendung:");
  console.error(
    "  node scripts/setRole.mjs approve <uid>          ← genehmigen",
  );
  console.error("  node scripts/setRole.mjs reject  <uid>          ← ablehnen");
  console.error(
    "  node scripts/setRole.mjs revoke  <uid>          ← Rechte entziehen",
  );
  console.error(
    "  node scripts/setRole.mjs set     <uid> <rolle>  ← Rolle direkt setzen",
  );
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

try {
  const user = await admin.auth().getUser(uid);
  const label = user.email ?? uid;

  if (command === "approve") {
    const existing = user.customClaims ?? {};
    await admin.auth().setCustomUserClaims(uid, { ...existing, role: "user" });
    await db
      .doc(`roleRequests/${uid}`)
      .set({ status: "approved" }, { merge: true });
    console.log(`✓ Genehmigt: ${label} → role: user`);
    console.log(
      "  Nutzer muss sich neu einloggen damit das Token aktualisiert wird.",
    );
  } else if (command === "reject") {
    await db
      .doc(`roleRequests/${uid}`)
      .set({ status: "rejected" }, { merge: true });
    console.log(`✓ Abgelehnt: ${label} → kein Claim gesetzt`);
  } else if (command === "revoke") {
    const existing = user.customClaims ?? {};
    delete existing.role;
    await admin.auth().setCustomUserClaims(uid, existing);
    await db
      .doc(`roleRequests/${uid}`)
      .set({ status: "rejected" }, { merge: true });
    console.log(`✓ Rechte entzogen: ${label} → leere Claims`);
    console.log(
      "  Nutzer muss sich neu einloggen damit das Token aktualisiert wird.",
    );
  } else if (command === "set") {
    const existing = user.customClaims ?? {};
    await admin.auth().setCustomUserClaims(uid, { ...existing, role: roleArg });
    console.log(`✓ Rolle gesetzt: ${label} → role: ${roleArg}`);
    console.log(
      "  Nutzer muss sich neu einloggen damit das Token aktualisiert wird.",
    );
  }
} catch (err) {
  console.error("Fehler:", err.message);
  process.exit(1);
}

process.exit(0);
