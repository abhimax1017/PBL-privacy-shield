import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const users = [
  {
    id: 1,
    name: "Abhinav Muragundla",
    email: "abhinav@example.com",
    phone: "+91 98765 43210",
    pan: "ABCDE1234F",
    aadhaar: "1234 5678 9012",
    card: "4111 1111 1111 1111"
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 91234 56789",
    pan: "FGHIJ5678K",
    aadhaar: "9876 5432 1098",
    card: "5555 5555 5555 4444"
  }
];

const auditLog = [];

function maskEmail(value) {
  const [name, domain] = value.split("@");
  return `${name.slice(0, 2)}***@${domain}`;
}

function maskPhone(value) {
  return `+91 ******${value.replace(/\D/g, "").slice(-4)}`;
}

function maskPan(value) {
  return `*****${value.slice(-1)}`;
}

function maskAadhaar(value) {
  return `XXXX XXXX ${value.replace(/\D/g, "").slice(-4)}`;
}

function maskCard(value) {
  return `XXXX XXXX XXXX ${value.replace(/\D/g, "").slice(-4)}`;
}

function maskedUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: maskEmail(user.email),
    phone: maskPhone(user.phone),
    pan: maskPan(user.pan),
    aadhaar: maskAadhaar(user.aadhaar),
    card: maskCard(user.card)
  };
}

app.get("/api/users", (req, res) => {
  res.json(users.map(maskedUser));
});

app.post("/api/users/:id/reveal", (req, res) => {
  const role = req.body.role || "viewer";
  const user = users.find((item) => item.id === Number(req.params.id));

  if (!user) return res.status(404).json({ message: "User not found" });

  if (role !== "admin") {
    return res.status(403).json({
      message: "Only authorised admin users can reveal confidential information."
    });
  }

  const revealed = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    pan: user.pan,
    aadhaar: user.aadhaar,
    card: user.card
  };

  auditLog.push({
    userId: user.id,
    action: "PII_REVEALED",
    role,
    timestamp: new Date().toISOString()
  });

  res.json(revealed);
});

app.get("/api/audit", (req, res) => {
  res.json(auditLog);
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "privacy-api" });
});

app.listen(5000, () => {
  console.log("Privacy API running on http://localhost:5000");
});