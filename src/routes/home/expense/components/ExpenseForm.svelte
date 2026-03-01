<script>
    import Buttons from "$lib/Components/Buttons.svelte";

    export let onSubmit;
    export let loading = false;
    export let initialData = null;

    let form = {
        title: initialData?.title || "",
        amount: initialData?.amount || "",
        category: initialData?.category || "",
        date: initialData?.date || new Date().toISOString().split("T")[0],
        notes: initialData?.notes || "",
    };

    async function handleSubmit() {
        if (!form.title || !form.amount) {
            alert("Título y monto son obligatorios");
            return;
        }

        const data = {
            ...form,
            type: "expense",
            amount: Number(form.amount)
        };

        await onSubmit(data);
    }
</script>

<div class="w-full flex justify-center">
    <form
        on:submit|preventDefault={handleSubmit}
        class="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6 sm:p-8 flex flex-col gap-6"
    >
        <!-- Título -->
        <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-600" for="title">
                Título del egreso
            </label>
            <input
                type="text"
                bind:value={form.title}
                placeholder="Ej: Alquiler mensual"
                class="w-full rounded-xl border border-gray-200 px-4 py-3
                       focus:outline-none focus:ring-2 focus:ring-red-500
                       focus:border-transparent transition"
            />
        </div>

        <!-- Grid responsive -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Monto -->
            <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-600" for="amount">
                    Monto
                </label>
                <input
                    type="number"
                    step="0.01"
                    bind:value={form.amount}
                    placeholder="0.00"
                    class="w-full rounded-xl border border-gray-200 px-4 py-3
                           focus:outline-none focus:ring-2 focus:ring-red-500
                           focus:border-transparent transition"
                />
            </div>

            <!-- Fecha -->
            <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-600" for="date">
                    Fecha
                </label>
                <input
                    type="date"
                    bind:value={form.date}
                    class="w-full rounded-xl border border-gray-200 px-4 py-3
                           focus:outline-none focus:ring-2 focus:ring-red-500
                           focus:border-transparent transition"
                />
            </div>
        </div>

        <!-- Categoría -->
        <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-600" for="category">
                Categoría
            </label>
            <select
                bind:value={form.category}
                class="w-full rounded-xl border border-gray-200 px-4 py-3
                       focus:outline-none focus:ring-2 focus:ring-red-500
                       focus:border-transparent transition bg-white"
            >
                <option value="">Selecciona una categoría</option>
                <option value="alquiler">Alquiler</option>
                <option value="servicios">Servicios</option>
                <option value="alimentacion">Alimentación</option>
                <option value="transporte">Transporte</option>
                <option value="entretenimiento">Entretenimiento</option>
                <option value="salud">Salud</option>
                <option value="educacion">Educación</option>
                <option value="otros">Otros</option>
            </select>
        </div>

        <!-- Notas -->
        <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-600" for="notes">
                Notas (opcional)
            </label>
            <textarea
                bind:value={form.notes}
                rows="3"
                placeholder="Detalles adicionales..."
                class="w-full rounded-xl border border-gray-200 px-4 py-3
                       focus:outline-none focus:ring-2 focus:ring-red-500
                       focus:border-transparent transition resize-none"
            ></textarea>
        </div>

        <!-- Botón -->
        <div class="flex justify-end pt-2">
            <Buttons>
                {#if loading}
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Guardando...
                {:else}
                    <i class="fa-solid fa-plus"></i>
                    Añadir egreso
                {/if}
            </Buttons>
        </div>
    </form>
</div>
