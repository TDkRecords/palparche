<script>
    import { goto } from "$app/navigation";
    import Buttons from "$lib/Components/Buttons.svelte";

    import { auth, provider, db } from "$lib/js/firebase";
    import { signInWithPopup } from "firebase/auth";
    import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

    let texts = [
        {
            title: "Finanzas en grupo, sin complicaciones",
            body: "Registra ingresos y gastos compartidos desde un solo lugar.",
        },
        {
            title: "Transparencia total",
            body: "Todos los miembros ven los movimientos y el saldo actualizado al instante.",
        },
        {
            title: "Control real del dinero",
            body: "Visualiza balances, historial y movimientos cuando lo necesites.",
        },
        {
            title: "Empieza ahora",
            body: "Crea tu grupo y administra el dinero en equipo.",
        },
    ];

    let currentStep = 0;

    async function loginWithGoogle() {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                // Crear documento solo si no existe
                await setDoc(userRef, {
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    createdAt: serverTimestamp(),
                });
            }

            goto("/home");
        } catch (error) {
            console.error("Error en login:", error);
        }
    }

    function nextStep() {
        if (currentStep < texts.length - 1) {
            currentStep += 1;
        } else {
            loginWithGoogle();
        }
    }
</script>

<div class="min-h-screen flex flex-col bg-white">
    <!-- Contenido principal -->
    <div class="flex-1 flex flex-col justify-center items-center px-6 py-8">
        <!-- Logo -->
        <img
            src="/images/LogoPalParche-witouth-bg.webp"
            alt="Logo Pal Parche"
            class="w-40 sm:w-48 md:w-56 lg:w-64 xl:w-72 mb-10 object-contain"
        />

        <!-- Texto -->
        <section
            class="w-full max-w-sm sm:max-w-md md:max-w-lg text-center space-y-6"
        >
            <h2
                class="text-xl sm:text-2xl md:text-3xl font-semibold leading-snug"
            >
                {texts[currentStep].title}
            </h2>

            <p
                class="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed px-2"
            >
                {texts[currentStep].body}
            </p>

            <div class="w-full max-w-sm sm:max-w-md mx-auto">
                <Buttons onClick={nextStep}>
                    {currentStep === texts.length - 1
                        ? "Iniciar Sesión"
                        : "Siguiente"}
                    <i class="fa-solid fa-arrow-right"></i>
                </Buttons>
            </div>
        </section>
    </div>

    <!-- Footer fijo tipo app -->
    <div class="px-6 pb-8 space-y-6">
        <!-- Indicadores -->
        <div class="flex justify-center gap-2">
            {#each texts as _, index}
                <div
                    class={`transition-all duration-300 ${
                        index === currentStep
                            ? "w-6 h-2 bg-black"
                            : "w-2 h-2 bg-gray-300"
                    } rounded-full`}
                ></div>
            {/each}
        </div>
    </div>
</div>
