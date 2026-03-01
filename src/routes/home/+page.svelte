<script>
    import { onMount } from "svelte";
    import { auth } from "$lib/js/firebase";
    import { onAuthStateChanged } from "firebase/auth";
    import {
        getTransactionsSummary,
        loadTransactions,
    } from "$lib/js/transactionService";
    import { loadGroup } from "$lib/js/groupService";
    import SummaryCard from "./components/SummaryCard.svelte";
    import RecentTransactions from "./components/RecentTransactions.svelte";

    let loading = true;
    let summary = {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        incomeCount: 0,
        expenseCount: 0,
    };
    let recentTransactions = [];
    let groupData = null;

    async function loadDashboardData() {
        try {
            groupData = await loadGroup();
            summary = await getTransactionsSummary();
            const allTransactions = await loadTransactions();
            recentTransactions = allTransactions.slice(0, 5);
        } catch (error) {
            console.error("Error cargando dashboard:", error);
        } finally {
            loading = false;
        }
    }

    function formatAmount(amount) {
        return new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "USD",
        }).format(amount || 0);
    }

    onMount(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                await loadDashboardData();
            }
        });
        return unsubscribe;
    });
</script>

<div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Header con gradiente -->
    <header
        class="bg-linear-to-r from-emerald-600 to-green-600 text-white px-4 sm:px-6 py-6 shadow-md"
    >
        <h1 class="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        {#if groupData}
            <p class="text-white/80 mt-1 text-sm sm:text-base">
                Grupo: {groupData.group?.name}
            </p>
        {:else}
            <p class="text-white/80 mt-1 text-sm sm:text-base">
                No perteneces a ningún grupo
            </p>
        {/if}
    </header>

    <main class="flex-1 p-4 sm:p-6 space-y-6">
        {#if loading}
            <div class="flex justify-center items-center py-12">
                <i class="fa-solid fa-spinner fa-spin text-3xl text-emerald-600"
                ></i>
            </div>
        {:else}
            <!-- Summary Cards -->
            <div
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
                <SummaryCard
                    title="Balance"
                    amount={summary.balance}
                    icon="fa-solid fa-wallet"
                    type="balance"
                />
                <SummaryCard
                    title="Ingresos"
                    amount={summary.totalIncome}
                    icon="fa-solid fa-arrow-trend-up"
                    type="income"
                    count={summary.incomeCount}
                />
                <SummaryCard
                    title="Egresos"
                    amount={summary.totalExpense}
                    icon="fa-solid fa-arrow-trend-down"
                    type="expense"
                    count={summary.expenseCount}
                />
            </div>

            <!-- Recent Transactions -->
            <RecentTransactions transactions={recentTransactions} />
        {/if}
    </main>
</div>
