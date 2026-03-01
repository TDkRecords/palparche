<script>
    import { onMount } from "svelte";
    import { auth } from "$lib/js/firebase";
    import { onAuthStateChanged } from "firebase/auth";
    import Buttons from "$lib/Components/Buttons.svelte";
    import ExpenseForm from "./components/ExpenseForm.svelte";
    import ExpenseList from "./components/ExpenseList.svelte";
    import {
        loadExpenses,
        createTransaction,
        deleteTransaction,
    } from "$lib/js/transactionService";

    let showPanel = false;
    let loading = false;
    let expenses = [];
    let totalExpense = 0;

    async function loadExpenseData() {
        try {
            expenses = await loadExpenses();
            totalExpense = expenses.reduce(
                (sum, e) => sum + (Number(e.amount) || 0),
                0,
            );
        } catch (error) {
            console.error("Error cargando egresos:", error);
            expenses = [];
        }
    }

    async function handleSubmit(data) {
        loading = true;
        try {
            await createTransaction(data);
            showPanel = false;
            await loadExpenseData();
            alert("Egreso registrado ✅");
        } catch (error) {
            console.error(error);
            alert("Error al registrar egreso: " + error.message);
        } finally {
            loading = false;
        }
    }

    async function handleDelete(id) {
        if (!confirm("¿Eliminar este egreso?")) return;
        try {
            await deleteTransaction(id);
            await loadExpenseData();
            alert("Egreso eliminado");
        } catch (error) {
            console.error(error);
            alert("Error al eliminar egreso");
        }
    }

    onMount(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                await loadExpenseData();
            }
        });
        return unsubscribe;
    });
</script>

<div class="flex flex-col items-center justify-start h-full gap-6">
    <header
        class="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
        <div class="flex flex-col">
            <h1 class="text-xl sm:text-2xl md:text-3xl font-bold">Egresos</h1>
            <p class="text-gray-500 text-sm sm:text-base max-w-md">
                Administra lo que sale de tus bolsillos, cuentas y deudas
            </p>
        </div>

        <div class="self-center sm:self-auto flex items-center gap-4">
            {#if totalExpense > 0}
                <div class="text-right">
                    <p class="text-sm text-gray-500">Total</p>
                    <p class="text-xl font-bold text-red-600">
                        -{new Intl.NumberFormat("es-ES", {
                            style: "currency",
                            currency: "USD",
                        }).format(totalExpense)}
                    </p>
                </div>
            {/if}
            <Buttons onClick={() => (showPanel = true)}>
                Registrar
                <i class="fa-solid fa-plus"></i>
            </Buttons>
        </div>
    </header>

    <main class="w-full">
        <ExpenseList {expenses} onDelete={handleDelete} />
    </main>

    <!-- SLIDE OVER -->
    <div class="fixed inset-0 z-50 pointer-events-none">
        <button
            class={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300
            ${showPanel ? "opacity-100 pointer-events-auto" : "opacity-0"}`}
            on:click={() => (showPanel = false)}
        >
        </button>

        <div
            class={`absolute top-0 right-0 h-full w-full
            sm:w-130
            bg-linear-to-b from-red-600 to-red-700
            shadow-2xl rounded-3xl
            transform transition-transform duration-300 ease-in-out
            ${showPanel ? "translate-x-0 pointer-events-auto" : "translate-x-full"}`}
        >
            <div class="h-full flex flex-col bg-white rounded-l-3xl shadow-xl">
                <div
                    class="flex justify-between items-center px-6 py-5 border-b border-gray-100"
                >
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800">
                            Nuevo Egreso
                        </h2>
                        <p class="text-sm text-gray-500">
                            Registra un nuevo egreso
                        </p>
                    </div>
                    <button
                        on:click={() => (showPanel = false)}
                        class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition"
                    >
                        <i class="fa-solid fa-xmark text-gray-600"></i>
                    </button>
                </div>

                <div class="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <ExpenseForm onSubmit={handleSubmit} {loading} />
                </div>
            </div>
        </div>
    </div>
</div>
