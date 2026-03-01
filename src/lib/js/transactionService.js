import { auth, db } from "$lib/js/firebase";

import {
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    collection,
    serverTimestamp,
    query,
    where,
    orderBy
} from "firebase/firestore";


/* =========================
   OBTENER GROUP ID DEL USUARIO
========================= */

async function getUserGroupId() {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const userSnap = await getDoc(doc(db, "users", user.uid));
    const groupId = userSnap.data()?.currentGroupId;

    if (!groupId) throw new Error("User has no group");

    return groupId;
}


/* =========================
   CREAR TRANSACCIÓN
========================= */

export async function createTransaction(data) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const groupId = await getUserGroupId();

    const transactionData = {
        ...data,
        groupId,
        createdBy: user.uid,
        createdByEmail: user.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };

    const ref = await addDoc(
        collection(db, "groups", groupId, "transactions"),
        transactionData
    );

    return { id: ref.id, ...transactionData };
}


/* =========================
   CARGAR TRANSACCIONES
========================= */

export async function loadTransactions(type = null) {
    const user = auth.currentUser;
    if (!user) return [];

    const groupId = await getUserGroupId();

    // Cargar todas las transacciones ordenadas por createdAt
    const q = query(
        collection(db, "groups", groupId, "transactions"),
        orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    let transactions = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    // Filtrar por tipo en el cliente si se especifica
    if (type) {
        transactions = transactions.filter(t => t.type === type);
    }

    return transactions;
}


/* =========================
   CARGAR INGRESOS
========================= */

export async function loadIncomes() {
    return loadTransactions("income");
}


/* =========================
   CARGAR EGRESOS
========================= */

export async function loadExpenses() {
    return loadTransactions("expense");
}


/* =========================
   ACTUALIZAR TRANSACCIÓN
========================= */

export async function updateTransaction(transactionId, data) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const groupId = await getUserGroupId();

    await updateDoc(
        doc(db, "groups", groupId, "transactions", transactionId),
        {
            ...data,
            updatedAt: serverTimestamp()
        }
    );
}


/* =========================
   ELIMINAR TRANSACCIÓN
========================= */

export async function deleteTransaction(transactionId) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const groupId = await getUserGroupId();

    await deleteDoc(
        doc(db, "groups", groupId, "transactions", transactionId)
    );
}


/* =========================
   RESUMEN DE TRANSACCIONES
========================= */

export async function getTransactionsSummary() {
    const transactions = await loadTransactions();

    const incomes = transactions.filter(t => t.type === "income");
    const expenses = transactions.filter(t => t.type === "expense");

    const totalIncome = incomes.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const totalExpense = expenses.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const balance = totalIncome - totalExpense;

    return {
        totalIncome,
        totalExpense,
        balance,
        incomeCount: incomes.length,
        expenseCount: expenses.length
    };
}
