<script>
    import Buttons from "$lib/Components/Buttons.svelte";

    let form = {
        title: "",
        amount: "",
        category: "",
        date: "",
        paymentMethod: "",
        notes: "",
    };

    function handleSubmit() {
        if (!form.title || !form.amount) {
            alert("Título y monto son obligatorios");
            return;
        }

        console.log("Nuevo egreso:", form);
        // Aquí conectas Supabase luego
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
                Descripción del egreso
            </label>
            <input
                type="text"
                bind:value={form.title}
                placeholder="Ej: Pago arriendo oficina"
                class="w-full rounded-xl border border-gray-200 px-4 py-3
                       focus:outline-none focus:ring-2 focus:ring-rose-500
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
                    bind:value={form.amount}
                    placeholder="0.00"
                    class="w-full rounded-xl border border-gray-200 px-4 py-3
                           focus:outline-none focus:ring-2 focus:ring-rose-500
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
                           focus:outline-none focus:ring-2 focus:ring-rose-500
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
                       focus:outline-none focus:ring-2 focus:ring-rose-500
                       focus:border-transparent transition bg-white"
            >
                <option value="">Selecciona una categoría</option>
                <option value="hogar">Hogar</option>
                <option value="transporte">Transporte</option>
                <option value="comida">Comida</option>
                <option value="suscripciones">Suscripciones</option>
                <option value="impuestos">Impuestos</option>
                <option value="otros">Otros</option>
            </select>
        </div>

        <!-- Método de pago -->
        <div class="flex flex-col gap-2">
            <label
                class="text-sm font-medium text-gray-600"
                for="paymentMethod"
            >
                Método de pago
            </label>
            <select
                bind:value={form.paymentMethod}
                class="w-full rounded-xl border border-gray-200 px-4 py-3
                       focus:outline-none focus:ring-2 focus:ring-rose-500
                       focus:border-transparent transition bg-white"
            >
                <option value="">Selecciona método</option>
                <option value="efectivo">Efectivo</option>
                <option value="debito">Débito</option>
                <option value="credito">Crédito</option>
                <option value="transferencia">Transferencia</option>
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
                       focus:outline-none focus:ring-2 focus:ring-rose-500
                       focus:border-transparent transition resize-none"
            ></textarea>
        </div>

        <!-- Botón -->
        <div class="flex justify-end pt-2">
            <Buttons>
                <i class="fa-solid fa-minus"></i>
                Añadir egreso
            </Buttons>
        </div>
    </form>
</div>
