<script>
    export let expenses = [];
    export let onDelete;

    const categoryLabels = {
        alquiler: "Alquiler",
        servicios: "Servicios",
        alimentacion: "Alimentación",
        transporte: "Transporte",
        entretenimiento: "Entretenimiento",
        salud: "Salud",
        educacion: "Educación",
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

{#if expenses.length === 0}
    <div
        class="bg-red-100 w-full min-h-50 flex flex-col justify-center items-center border-dashed border-2 border-red-600/20 p-4 rounded-xl"
    >
        <span class="text-black/25 text-bolder text-lg text-center">
            <i class="fa-solid fa-receipt text-4xl"></i>
            <p>No hay egresos registrados</p>
        </span>
    </div>
{:else}
    <div class="w-full space-y-3">
        {#each expenses as expense}
            <div
                class="bg-white rounded-xl shadow-md border border-gray-100 p-4 hover:shadow-lg transition"
            >
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h3 class="font-semibold text-gray-800">
                            {expense.title}
                        </h3>
                        <div
                            class="flex flex-wrap gap-2 mt-2 text-sm text-gray-500"
                        >
                            {#if expense.category}
                                <span
                                    class="bg-red-100 text-red-700 px-2 py-1 rounded-lg"
                                >
                                    {categoryLabels[expense.category] ||
                                        expense.category}
                                </span>
                            {/if}
                            <span class="text-gray-400">
                                <i class="fa-solid fa-calendar"></i>
                                {formatDate(expense.createdAt)}
                            </span>
                        </div>
                        {#if expense.notes}
                            <p class="text-sm text-gray-500 mt-2">
                                {expense.notes}
                            </p>
                        {/if}
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="text-lg font-bold text-red-600">
                            -{formatAmount(expense.amount)}
                        </span>
                        {#if onDelete}
                            <button
                                on:click={() => onDelete(expense.id)}
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
