// upload_all_quizzes.js
// Script to upload all quiz JSON files to Firestore collections (ESM version)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// ESM __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin SDK
initializeApp({
  credential: applicationDefault(),
});

const db = getFirestore();

// Map of quiz categories to their JSON filenames
const quizzes = {
  cricket: 'cricket_quiz_questions.json',
  american_football: 'american_football_quiz_questions.json',
  soccer: 'soccer_quiz_questions.json',
  formula1: 'formula1_quiz_questions.json',
  tennis: 'tennis_quiz_questions.json',
};

const assetsDir = path.join(__dirname, 'src', 'assets');

async function uploadQuiz(category, filename) {
  const filePath = path.join(assetsDir, filename);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const collectionRef = db.collection(category);
  for (const [i, question] of data.entries()) {
    // Add a random field for Firestore random selection trick
    question.random = Math.random();
    await collectionRef.add(question);
    console.log(`Uploaded question ${i + 1} to ${category}`);
  }
}

async function main() {
  for (const [category, filename] of Object.entries(quizzes)) {
    console.log(`Uploading ${filename} to collection ${category}...`);
    await uploadQuiz(category, filename);
  }
  console.log('All quizzes uploaded successfully!');
}

main().catch((err) => {
  console.error('Error uploading quizzes:', err);
  // process.exit(1); // Removed for compatibility
});
