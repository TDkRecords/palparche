<script>
    import { onMount } from "svelte";
    import { auth } from "$lib/js/firebase";
    import { onAuthStateChanged } from "firebase/auth";
    import Buttons from "$lib/Components/Buttons.svelte";
    import IncomeForm from "./components/IncomeForm.svelte";
    import IncomeList from "./components/IncomeList.svelte";
    import {
        loadIncomes,
        createTransaction,
        deleteTransaction,
    } from "$lib/js/transactionService";

    let showPanel = false;
    let loading = false;
    let incomes = [];
    let totalIncome = 0;

    async function loadIncomeData() {
        try {
            incomes = await loadIncomes();
            totalIncome = incomes.reduce(
                (sum, i) => sum + (Number(i.amount) || 0),
                0,
            );
        } catch (error) {
            console.error("Error cargando ingresos:", error);
            incomes = [];
        }
    }

    async function handleSubmit(data) {
        loading = true;
        try {
            await createTransaction(data);
            showPanel = false;
            await loadIncomeData();
            alert("Ingreso registrado ✅");
        } catch (error) {
            console.error(error);
            alert("Error al registrar ingreso: " + error.message);
        } finally {
            loading = false;
        }
    }

    async function handleDelete(id) {
        if (!confirm("¿Eliminar este ingreso?")) return;
        try {
            await deleteTransaction(id);
            await loadIncomeData();
            alert("Ingreso eliminado");
        } catch (error) {
            console.error(error);
            alert("Error al eliminar ingreso");
        }
    }

    onMount(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                await loadIncomeData();
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
            <h1 class="text-xl sm:text-2xl md:text-3xl font-bold">Ingresos</h1>
            <p class="text-gray-500 text-sm sm:text-base max-w-md">
                Administra tus ingresos freelance, sueldo y/o regalías en
                conjunto
            </p>
        </div>

        <div class="self-center sm:self-auto flex items-center gap-4">
            {#if totalIncome > 0}
                <div class="text-right">
                    <p class="text-sm text-gray-500">Total</p>
                    <p class="text-xl font-bold text-emerald-600">
                        +{new Intl.NumberFormat("es-ES", {
                            style: "currency",
                            currency: "USD",
                        }).format(totalIncome)}
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
        <IncomeList {incomes} onDelete={handleDelete} />
    </main>

    <!-- SLIDE OVER -->
    <div class="fixed inset-0 z-50 pointer-events-none">
        <button
            class={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300
            ${showPanel ? "opacity-100 pointer-events-auto" : "opacity-0"}`}
            on:click={() => (showPanel = false)}
            aria-label="Cerrar panel"
        >
        </button>

        <div
            class={`absolute top-0 right-0 h-full w-full
            sm:w-130
            bg-linear-to-b from-emerald-600 to-green-600
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
                            Nuevo ingreso
                        </h2>
                        <p class="text-sm text-gray-500">
                            Registra un nuevo movimiento
                        </p>
                    </div>
                    <button
                        on:click={() => (showPanel = false)}
                        class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition"
                        aria-label="Cerrar panel"
                    >
                        <i class="fa-solid fa-xmark text-gray-600"></i>
                    </button>
                </div>

                <div class="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <IncomeForm onSubmit={handleSubmit} {loading} />
                </div>
            </div>
        </div>
    </div>
</div>
