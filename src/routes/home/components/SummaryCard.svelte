<script>
    export let title;
    export let amount;
    export let icon;
    export let type = "balance";
    export let count = null;

    function formatAmount(value) {
        return new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "USD",
        }).format(value || 0);
    }

    const colorClasses = {
        income: "from-emerald-500 to-green-600 text-white",
        expense: "from-red-500 to-orange-600 text-white",
        balance: "from-emerald-600 to-green-700 text-white",
    };

    const iconBgClasses = {
        income: "bg-white/20",
        expense: "bg-white/20",
        balance: "bg-white/20",
    };
</script>

<div
    class="bg-linear-to-br {colorClasses[
        type
    ]} rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
>
    <div class="flex items-center justify-between gap-2">
        <div class="min-w-0 flex-1">
            <p class="text-xs sm:text-sm opacity-80 truncate">{title}</p>
            <p class="text-xl sm:text-2xl lg:text-3xl font-bold mt-1">
                {#if type === "expense"}
                    -
                {/if}
                {formatAmount(amount)}
            </p>
            {#if count !== null}
                <p class="text-xs sm:text-sm opacity-70 mt-1">
                    {count} registros
                </p>
            {/if}
        </div>
        <div class="{iconBgClasses[type]} p-3 sm:p-4 rounded-xl shrink-0">
            <i class="{icon} text-lg sm:text-2xl"></i>
        </div>
    </div>
</div>
