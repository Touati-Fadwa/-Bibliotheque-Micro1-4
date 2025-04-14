// src/lib/mockData.js
export const adminUser = {
  id: "admin-1",
  username: "admin",
  password: "admin123",
  email: "admin@iset.tn",
  role: "admin",
  firstName: "Admin",
  lastName: "User",
  department: "Administration",
  createdAt: new Date()
};

export const studentUsers = [
  {
    id: "student-1",
    username: "etudiant1",
    password: "etudiant123",
    email: "etudiant1@iset.tn",
    role: "student",
    firstName: "Jean",
    lastName: "Dupont",
    studentId: "STD12345",
    department: "Informatique",
    createdAt: new Date()
  },
  {
    id: "student-2",
    username: "etudiant2",
    password: "etudiant123",
    email: "etudiant2@iset.tn",
    role: "student",
    firstName: "Marie",
    lastName: "Martin",
    studentId: "STD54321",
    department: "Gestion",
    createdAt: new Date()
  }
];

export const books = [
  {
    id: "book-1",
    title: "Introduction à React",
    author: "Pierre Dupont",
    isbn: "123-4567890123",
    available: true,
    borrowedBy: null,
    dueDate: null
  },
  {
    id: "book-2",
    title: "Advanced TypeScript",
    author: "Marie Martin",
    isbn: "456-7890123456",
    available: false,
    borrowedBy: "student-1",
    dueDate: "2023-12-15"
  }
];

export const borrowedBooks = [
  {
    id: "borrowed-1",
    bookId: "book-2",
    userId: "student-1",
    borrowDate: "2023-11-15",
    returnDate: null
  }
];