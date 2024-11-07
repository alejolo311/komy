import { Button } from '@/components/ui/button';
import { ChefHat, BarChart2, Brain, Wallet, ArrowRight, ShieldCheck, Zap, Clock, Utensils, Receipt, Calendar, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Landing() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
            {/* Simple Nav */}
            <nav className="absolute top-0 left-0 right-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <Link to="/" className="text-2xl font-bold text-white">KOMY</Link>
                        <div className="flex gap-4">
                            <Button variant="ghost" className="text-gray-300 hover:text-white" asChild>
                                <Link to="/login">Iniciar Sesión</Link>
                            </Button>
                            <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
                                <Link to="/register">Registrarse</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative overflow-hidden min-h-[90vh] flex items-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574966739987-27c7f024868f?q=80&w=2942')] bg-cover bg-center opacity-10" />
                <div className="relative w-full">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-7xl sm:text-9xl font-black tracking-tighter text-white mb-4">
                            KOMY
                        </h1>
                        <p className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600 mb-6">
                            Revoluciona tu Restaurante con IA
                        </p>
                        <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
                            Software de gestión de restaurantes que utiliza Inteligencia Artificial para optimizar tus costos y maximizar tus ganancias.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 py-6 text-lg font-semibold"
                                asChild
                            >
                                <Link to="/register">
                                    Comienza Ahora
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-gray-600 text-gray-300 hover:bg-gray-800 rounded-full px-8 py-6 text-lg font-semibold"
                                asChild
                            >
                                <Link to="/login">Iniciar Sesión</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Todo lo que Necesitas en Un Solo Lugar
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Gestiona tu restaurante de manera inteligente y eficiente
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        {
                            icon: ChefHat,
                            title: "Recetas y Costeo",
                            description: "Calcula costos precisos y optimiza tus recetas automáticamente"
                        },
                        {
                            icon: Utensils,
                            title: "Gestión de Mesas",
                            description: "Control de mesas, pedidos y estados en tiempo real"
                        },
                        {
                            icon: Receipt,
                            title: "Facturación Electrónica",
                            description: "Facturación DIAN integrada y automatizada"
                        },
                        {
                            icon: Calendar,
                            title: "Sistema de Reservas",
                            description: "Gestiona reservas y optimiza tu capacidad"
                        },
                        {
                            icon: BarChart2,
                            title: "Análisis Detallado",
                            description: "Visualiza tus métricas clave y toma decisiones informadas"
                        },
                        {
                            icon: Brain,
                            title: "IA Integrada",
                            description: "Predicciones y recomendaciones basadas en tus datos"
                        },
                        {
                            icon: Wallet,
                            title: "Control de Gastos",
                            description: "Monitorea y optimiza tus costos operativos"
                        },
                        {
                            icon: Truck,
                            title: "Gestión de Domicilios",
                            description: "Control de entregas y seguimiento en tiempo real"
                        }
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:transform hover:-translate-y-1 transition-all duration-300"
                        >
                            <feature.icon className="h-12 w-12 text-emerald-500 mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                            <p className="text-gray-400">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pricing Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
                <div className="absolute inset-0 bg-emerald-600/10 blur-3xl" />
                <div className="relative">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Precio Único y Transparente
                        </h2>
                        <p className="text-gray-400 text-lg">
                            Sin sorpresas, sin costos ocultos
                        </p>
                    </div>

                    <div className="max-w-lg mx-auto bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:transform hover:-translate-y-1 transition-all duration-300">
                        <div className="text-center mb-8">
                            <span className="text-5xl font-bold text-white">$160.000</span>
                            <span className="text-gray-400 ml-2">COP/mes</span>
                        </div>

                        <div className="space-y-4 mb-8">
                            {[
                                { icon: ShieldCheck, text: "Acceso completo a todas las funcionalidades" },
                                { icon: Zap, text: "Actualizaciones automáticas y nuevas características" },
                                { icon: Brain, text: "IA para optimización de costos y predicciones" },
                                { icon: Clock, text: "Soporte técnico 24/7" }
                            ].map((feature, index) => (
                                <div key={index} className="flex items-center text-gray-300">
                                    <feature.icon className="h-5 w-5 text-emerald-500 mr-3" />
                                    <span>{feature.text}</span>
                                </div>
                            ))}
                        </div>

                        <Button
                            size="lg"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full py-6 text-lg font-semibold"
                            asChild
                        >
                            <Link to="/register">
                                Prueba Gratis por 14 Días
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 sm:p-12">
                    <div className="text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            ¿Listo para Transformar tu Restaurante?
                        </h2>
                        <p className="text-gray-100 text-lg mb-8">
                            Únete a los restaurantes que ya están optimizando sus operaciones con Komy
                        </p>
                        <Button
                            size="lg"
                            className="bg-white text-emerald-600 hover:bg-gray-100 rounded-full px-8 py-6 text-lg font-semibold"
                            asChild
                        >
                            <Link to="/register">
                                Comienza tu Prueba Gratuita
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center text-gray-400">
                        <p>© 2024 Komy. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}