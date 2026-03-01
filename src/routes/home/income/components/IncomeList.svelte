<script>
    export let incomes = [];
    export let onDelete;

    const categoryLabels = {
        freelance: "Freelance",
        salario: "Salario",
        regalias: "Regalías",
        inversiones: "Inversiones",
        otros: "Otros",
    };

    function formatDate(timestamp) {
        if (!timestamp) return "";
        const date = timestamp.toDate
            ? timestamp.toDate()
            : new Date(timestamp);
        return date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }

    function formatAmount(amount) {
        return new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "USD",
        }).format(amount || 0);
    }
</script>

{#if incomes.length === 0}
    <div
        class="bg-lime-100 w-full min-h-50 flex flex-col justify-center items-center border-dashed border-2 border-lime-600/20 p-4 rounded-xl"
    >
        <span class="text-black/25 text-bolder text-lg text-center">
            <i class="fa-solid fa-money-bill-trend-up text-4xl"></i>
            <p>No hay ingresos registrados</p>
        </span>
    </div>
{:else}
    <div class="w-full space-y-3">
        {#each incomes as income}
            <div
                class="bg-white rounded-xl shadow-md border border-gray-100 p-4 hover:shadow-lg transition"
            >
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h3 class="font-semibold text-gray-800">
                            {income.title}
                        </h3>
                        <div
                            class="flex flex-wrap gap-2 mt-2 text-sm text-gray-500"
                        >
                            {#if income.category}
                                <span
                                    class="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg"
                                >
                                    {categoryLabels[income.category] ||
                                        income.category}
                                </span>
                            {/if}
                            <span class="text-gray-400">
                                <i class="fa-solid fa-calendar"></i>
                                {formatDate(income.createdAt)}
                            </span>
                        </div>
                        {#if income.notes}
                            <p class="text-sm text-gray-500 mt-2">
                                {income.notes}
                            </p>
                        {/if}
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="text-lg font-bold text-emerald-600">
                            +{formatAmount(income.amount)}
                        </span>
                        {#if onDelete}
                            <button
                                on:click={() => onDelete(income.id)}
                                class="text-red-400 hover:text-red-600 transition"
                                title="Eliminar"
                            >
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        {/if}
                    </div>
                </div>
            </div>
        {/each}
    </div>
{/if}
