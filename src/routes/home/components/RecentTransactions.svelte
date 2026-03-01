<script>
    export let transactions = [];

    function formatDate(timestamp) {
        if (!timestamp) return "";
        const date = timestamp.toDate
            ? timestamp.toDate()
            : new Date(timestamp);
        return date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
        });
    }

    function formatAmount(amount) {
        return new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "USD",
        }).format(amount || 0);
    }
</script>

<div
    class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
>
    <div
        class="px-4 sm:px-6 py-4 border-b border-gray-100 flex justify-between items-center"
    >
        <h2 class="text-base sm:text-lg font-semibold text-gray-800">
            Movimientos recientes
        </h2>
        <a
            href="/home/income"
            class="text-xs sm:text-sm text-emerald-600 hover:text-emerald-700 font-medium transition"
        >
            Ver todos
        </a>
    </div>

    {#if transactions.length === 0}
        <div class="p-6 text-center text-gray-500">
            <i class="fa-solid fa-inbox text-3xl text-gray-300 mb-2"></i>
            <p class="text-sm">No hay movimientos registrados</p>
        </div>
    {:else}
        <div class="divide-y divide-gray-100">
            {#each transactions as transaction}
                <div
                    class="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-emerald-50/30 transition"
                >
                    <div
                        class="flex items-center gap-3 sm:gap-4 min-w-0 flex-1"
                    >
                        <div
                            class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0
                            {transaction.type === 'income'
                                ? 'bg-emerald-100 text-emerald-600'
                                : 'bg-red-100 text-red-600'}"
                        >
                            <i
                                class="fa-solid {transaction.type === 'income'
                                    ? 'fa-arrow-up'
                                    : 'fa-arrow-down'} text-sm sm:text-base"
                            ></i>
                        </div>
                        <div class="min-w-0 flex-1">
                            <p
                                class="font-medium text-gray-800 text-sm sm:text-base truncate"
                            >
                                {transaction.title}
                            </p>
                            <p class="text-xs sm:text-sm text-gray-500">
                                {formatDate(transaction.createdAt)}
                            </p>
                        </div>
                    </div>
                    <p
                        class="font-semibold text-sm sm:text-base shrink-0 ml-2 {transaction.type ===
                        'income'
                            ? 'text-emerald-600'
                            : 'text-red-600'}"
                    >
                        {transaction.type === "income"
                            ? "+"
                            : "-"}{formatAmount(transaction.amount)}
                    </p>
                </div>
            {/each}
        </div>
    {/if}
</div>
