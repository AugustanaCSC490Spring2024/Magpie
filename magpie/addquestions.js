const admin = require('firebase-admin');

const serviceAccount = require('./service_accounts.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const questions = [
  // {
  //   questionText: "Add questions",
  //   options: ["option1, option2"],
  //   order: "start with 3"
  // },
  // Add more questions as needed
];

async function addQuestions() {
  const batch = db.batch();

  questions.forEach(question => {
    const docRef = db.collection('onboardingQuestions').doc(); // Auto-generate document ID
    batch.set(docRef, question);
  });

  await batch.commit();
  console.log('Questions added successfully');
}

addQuestions().catch(console.error);