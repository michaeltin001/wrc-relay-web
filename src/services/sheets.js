import { getFunctions, httpsCallable } from "firebase/functions";

export const submitLog = async (studentId) => {
  const functions = getFunctions();
  const logStudentId = httpsCallable(functions, "logStudentId");
  
  await logStudentId({ studentId });
};
