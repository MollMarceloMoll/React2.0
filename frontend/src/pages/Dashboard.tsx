import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Wheat,
  Gift,
  Syringe,
  ShoppingCart,
  Users,
  BarChart3,
  Plus,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  BookOpen,
  AlertCircle
} from 'lucide-react';

interface QuickAccessCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  color: string;
  badge?: string;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Home = () => {
  const navigate = useNavigate();
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);

  // Accesos rápidos (basado en el Sidebar)
  const quickAccess: QuickAccessCard[] = [
    {
      id: '1',
      title: 'Dashboard',
      description: 'Panel de control principal',
      icon: <LayoutDashboard className="w-6 h-6" />,
      link: '/dashboard',
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
    },
    {
      id: '2',
      title: 'Mascotas',
      description: 'Gestiona productos de mascotas',
      icon: <Package className="w-6 h-6" />,
      link: '/productos',
      color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
    },
    {
      id: '3',
      title: 'Granja',
      description: 'Productos y servicios de granja',
      icon: <Wheat className="w-6 h-6" />,
      link: '/granja',
      color: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200'
    },
    {
      id: '4',
      title: 'Accesorios',
      description: 'Accesorios y complementos',
      icon: <Gift className="w-6 h-6" />,
      link: '/accesorios',
      color: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200'
    },
    {
      id: '5',
      title: 'Veterinaria',
      description: 'Productos veterinarios',
      icon: <Syringe className="w-6 h-6" />,
      link: '/veterinaria',
      color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
    },
    {
      id: '6',
      title: 'Ventas',
      description: 'Registra y gestiona ventas',
      icon: <ShoppingCart className="w-6 h-6" />,
      link: '/ventas',
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200'
    },
    {
      id: '7',
      title: 'Usuarios',
      description: 'Configuración de cuenta',
      icon: <Users className="w-6 h-6" />,
      link: '/usuarios',
      color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
    },
    {
      id: '8',
      title: 'Reportes',
      description: 'Análisis y reportes',
      icon: <BarChart3 className="w-6 h-6" />,
      link: '/reportes',
      color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-200'
    }
  ];

  // Características del programa
  const features: Feature[] = [
    {
      id: '1',
      title: 'Gestión de Inventario',
      description: 'Controla el stock de productos en tiempo real',
      icon: <Package className="w-8 h-8 text-blue-600" />
    },
    {
      id: '2',
      title: 'Registro de Ventas',
      description: 'Registra y monitorea todas tus transacciones',
      icon: <ShoppingCart className="w-8 h-8 text-green-600" />
    },
    {
      id: '3',
      title: 'Reportes Detallados',
      description: 'Genera reportes de ventas y análisis',
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />
    },
    {
      id: '4',
      title: 'Gestión de Usuarios',
      description: 'Administra tu perfil y configuración',
      icon: <Users className="w-8 h-8 text-amber-600" />
    },
    {
      id: '5',
      title: 'Dashboard en Vivo',
      description: 'Visualiza estadísticas al instante',
      icon: <TrendingUp className="w-8 h-8 text-pink-600" />
    },
    {
      id: '6',
      title: 'Seguridad',
      description: 'Protección de datos y privacidad',
      icon: <Shield className="w-8 h-8 text-red-600" />
    }
  ];

  // Guía de uso
  const guides = [
    {
      id: 'comience',
      title: '🚀 Comience Aquí',
      steps: [
        'Vaya al Dashboard para ver un resumen de su negocio',
        'Agregue productos en Mascotas, Granja, Accesorios o Veterinaria',
        'Registre ventas en la sección de Ventas',
        'Consulte reportes en la sección de Reportes'
      ]
    },
    {
      id: 'productos',
      title: '📦 Gestión de Productos',
      steps: [
        'Acceda a cada categoría (Mascotas, Granja, Accesorios, Veterinaria)',
        'Use el botón "Nuevo" para crear nuevos productos',
        'Edite o elimine productos existentes según sea necesario',
        'Mantenga actualizado el inventario'
      ]
    },
    {
      id: 'ventas',
      title: '💰 Registrar Ventas',
      steps: [
        'Vaya a la sección de Ventas',
        'Cree una nueva venta seleccionando cliente y productos',
        'Ingrese la cantidad y el precio',
        'Confirme la transacción para registrarla'
      ]
    },
    {
      id: 'reportes',
      title: '📊 Análisis y Reportes',
      steps: [
        'Acceda a Reportes para ver análisis detallados',
        'Filtre por período (día, semana, mes)',
        'Exporte datos en PDF o Excel',
        'Identifique tendencias y oportunidades'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Encabezado de bienvenida */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 text-white p-6 sm:p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Bienvenido a Forrajería
          </h1>
          <p className="text-blue-100 text-lg">
            Tu sistema integral de gestión de ventas y inventario
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto p-6 sm:p-8 lg:p-12">
        
        {/* Sección de accesos rápidos */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-500" />
            Accesos Rápidos
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickAccess.map((card) => (
              <Link
                key={card.id}
                to={card.link}
                className="group bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-lg transition p-6 border border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${card.color}`}>
                  {card.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {card.description}
                </p>
                <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:gap-2 transition">
                  Ir <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sección de características */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-500" />
            Características Principales
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-gray-200 dark:border-slate-700"
              >
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sección de guías de uso */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-green-500" />
            Cómo Usar el Programa
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {guides.map((guide) => (
              <div
                key={guide.id}
                className="bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-200 dark:border-slate-700 overflow-hidden"
              >
                <button
                  onClick={() => setSelectedGuide(selectedGuide === guide.id ? null : guide.id)}
                  className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition flex items-center justify-between"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {guide.title}
                  </h3>
                  <ArrowRight
                    className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${
                      selectedGuide === guide.id ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {selectedGuide === guide.id && (
                  <div className="border-t border-gray-200 dark:border-slate-700 p-6 bg-gray-50 dark:bg-slate-700/50">
                    <ol className="space-y-3">
                      {guide.steps.map((step, idx) => (
                        <li key={idx} className="flex gap-4">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                            {idx + 1}
                          </span>
                          <span className="text-gray-700 dark:text-gray-300 pt-0.5">
                            {step}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tarjeta de información adicional */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 sm:p-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                💡 Consejo: Comience por el Dashboard
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Le recomendamos que comience visitando el Dashboard para ver un resumen de su negocio. 
                Luego, agregue productos y registre sus primeras ventas. Los reportes le mostrarán 
                el rendimiento de su negocio a lo largo del tiempo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 mt-12 p-6 sm:p-8">
        <div className="max-w-6xl mx-auto text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>
            ¿Necesita ayuda? Consulte la documentación o contacte al equipo de soporte.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;