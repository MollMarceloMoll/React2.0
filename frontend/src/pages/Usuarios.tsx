import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader,
  Save,
  X
} from 'lucide-react';

interface FormErrors {
  [key: string]: string;
}

interface SuccessMessage {
  type: 'email' | 'password' | null;
  message: string;
}

const Usuarios = () => {
  // Estados para el formulario de email
  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    currentPassword: ''
  });

  // Estados para el formulario de contraseña
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Estados de UI
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState<SuccessMessage>({ type: null, message: '' });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  
  // Estados para cargar el usuario actual
  const [currentEmail, setCurrentEmail] = useState('');
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState('');

  // Cargar el usuario actual cuando el componente se monta
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoadingUser(true);
        setUserError('');
        const response = await api.get('/usuarios/me');
        setCurrentEmail(response.data.email);
      } catch (error: any) {
        console.error('Error al obtener usuario:', error);
        setUserError('Error al cargar el correo electrónico');
      } finally {
        setLoadingUser(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Validaciones
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateEmailForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!emailForm.newEmail.trim()) {
      newErrors.newEmail = 'El correo electrónico es requerido';
    } else if (!validateEmail(emailForm.newEmail)) {
      newErrors.newEmail = 'Ingresa un correo electrónico válido';
    } else if (emailForm.newEmail === currentEmail) {
      newErrors.newEmail = 'El nuevo correo debe ser diferente al actual';
    }

    if (!emailForm.currentPassword.trim()) {
      newErrors.currentPassword = 'La contraseña actual es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!passwordForm.currentPassword.trim()) {
      newErrors.currentPassword = 'La contraseña actual es requerida';
    }

    if (!passwordForm.newPassword.trim()) {
      newErrors.newPassword = 'La nueva contraseña es requerida';
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!validatePassword(passwordForm.newPassword)) {
      newErrors.newPassword = 'Debe contener mayúscula, minúscula, número y símbolo (@$!%*?&)';
    }

    if (!passwordForm.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirma la nueva contraseña';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (passwordForm.newPassword === passwordForm.currentPassword) {
      newErrors.newPassword = 'La nueva contraseña debe ser diferente a la actual';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejadores de formularios
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmailForm()) return;

    setLoading(true);
    try {
      await api.post('/usuarios/change-email', {
        newEmail: emailForm.newEmail,
        currentPassword: emailForm.currentPassword
      });

      setCurrentEmail(emailForm.newEmail);

      setSuccess({
        type: 'email',
        message: 'Correo electrónico actualizado exitosamente'
      });
      
      setEmailForm({ newEmail: '', currentPassword: '' });
      
      setTimeout(() => {
        setSuccess({ type: null, message: '' });
      }, 4000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al actualizar el correo. Intenta de nuevo.';
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setLoading(true);
    try {
      await api.post('/usuarios/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword
      });

      setSuccess({
        type: 'password',
        message: 'Contraseña actualizada exitosamente'
      });
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setTimeout(() => {
        setSuccess({ type: null, message: '' });
      }, 4000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al actualizar la contraseña. Intenta de nuevo.';
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const resetEmailForm = () => {
    setEmailForm({ newEmail: '', currentPassword: '' });
    setErrors({});
    setSuccess({ type: null, message: '' });
  };

  const resetPasswordForm = () => {
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setErrors({});
    setSuccess({ type: null, message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gestión de Cuenta
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Actualiza tu información de perfil de forma segura
          </p>
        </div>

        {/* Tarjeta principal */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
          
          {/* Navegación de pestañas */}
          <div className="flex border-b border-gray-200 dark:border-slate-700">
            <button
              onClick={() => {
                setActiveTab('profile');
                resetEmailForm();
              }}
              className={`flex-1 py-4 px-6 font-semibold text-center transition duration-200 flex items-center justify-center gap-2
                ${activeTab === 'profile'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }
              `}
            >
              <Mail className="w-5 h-5" />
              Correo Electrónico
            </button>
            <button
              onClick={() => {
                setActiveTab('password');
                resetPasswordForm();
              }}
              className={`flex-1 py-4 px-6 font-semibold text-center transition duration-200 flex items-center justify-center gap-2
                ${activeTab === 'password'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }
              `}
            >
              <Lock className="w-5 h-5" />
              Contraseña
            </button>
          </div>

          {/* Contenido */}
          <div className="p-8 sm:p-10">
            
            {/* Mensaje de éxito */}
            {success.type && (
              <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 animation-fade-in
                ${success.type === 'email' 
                  ? 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-200'
                  : 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-200'
                }
              `}>
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{success.message}</span>
              </div>
            )}

            {/* Mensaje de error al cargar usuario */}
            {errors.submit && (
              <div className="mb-6 p-4 rounded-lg flex items-center gap-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{errors.submit}</span>
              </div>
            )}

            {/* Formulario de correo electrónico */}
            {activeTab === 'profile' && (
              <form onSubmit={handleEmailSubmit}>
                <div className="space-y-6">
                  {/* Correo actual */}
                  <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Correo electrónico actual
                    </p>
                    {loadingUser ? (
                      <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                        Cargando...
                      </p>
                    ) : userError ? (
                      <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                        {userError}
                      </p>
                    ) : (
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {currentEmail || 'No disponible'}
                      </p>
                    )}
                  </div>

                  {/* Nuevo correo */}
                  <div className="mb-5">
                    <label htmlFor="newEmail" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Nuevo Correo Electrónico
                    </label>
                    <input
                      id="newEmail"
                      name="newEmail"
                      type="email"
                      value={emailForm.newEmail}
                      onChange={handleEmailChange}
                      placeholder="ejemplo@correo.com"
                      className={`w-full px-4 py-2.5 rounded-lg border transition duration-200 outline-none
                        ${errors.newEmail 
                          ? 'border-red-400 bg-red-50 dark:bg-red-950 dark:border-red-600 focus:ring-2 focus:ring-red-300 dark:focus:ring-red-700' 
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500'
                        }
                      `}
                      disabled
                    />
                    {errors.newEmail && (
                      <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.newEmail}
                      </p>
                    )}
                  </div>

                  {/* Contraseña actual */}
                  <div className="mb-5">
                    <label htmlFor="emailCurrentPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Contraseña Actual (confirmación)
                    </label>
                    <div className="relative">
                      <input
                        id="emailCurrentPassword"
                        name="currentPassword"
                        type={showPasswords.current ? 'text' : 'password'}
                        value={emailForm.currentPassword}
                        onChange={handleEmailChange}
                        placeholder="Ingresa tu contraseña"
                        autoComplete="current-password"
                        className={`w-full px-4 py-2.5 rounded-lg border transition duration-200 outline-none
                          ${errors.currentPassword 
                            ? 'border-red-400 bg-red-50 dark:bg-red-950 dark:border-red-600 focus:ring-2 focus:ring-red-300 dark:focus:ring-red-700' 
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500'
                          }
                        `}
                        disabled
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
                      >
                        {showPasswords.current ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.currentPassword}
                      </p>
                    )}
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-4 mt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition duration-200
                      ${loading 
                        ? 'bg-blue-400 dark:bg-blue-600 text-white cursor-not-allowed' 
                        : 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-95'
                      }
                    `}
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Actualizando...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Actualizar Correo
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetEmailForm}
                    disabled={loading}
                    className="py-3 px-6 rounded-lg font-semibold border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {/* Formulario de contraseña */}
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit}>
                <div className="space-y-6">
                  {/* Contraseña actual */}
                  <div className="mb-5">
                    <label htmlFor="passwordCurrentPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Contraseña Actual
                    </label>
                    <div className="relative">
                      <input
                        id="passwordCurrentPassword"
                        name="currentPassword"
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Ingresa tu contraseña actual"
                        autoComplete="current-password"
                        className={`w-full px-4 py-2.5 rounded-lg border transition duration-200 outline-none
                          ${errors.currentPassword 
                            ? 'border-red-400 bg-red-50 dark:bg-red-950 dark:border-red-600 focus:ring-2 focus:ring-red-300 dark:focus:ring-red-700' 
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500'
                          }
                        `}
                        disabled
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
                      >
                        {showPasswords.current ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.currentPassword}
                      </p>
                    )}
                  </div>

                  {/* Nueva contraseña */}
                  <div className="mb-5">
                    <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Nueva Contraseña
                    </label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        name="newPassword"
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Mínimo 8 caracteres"
                        autoComplete="new-password"
                        className={`w-full px-4 py-2.5 rounded-lg border transition duration-200 outline-none
                          ${errors.newPassword 
                            ? 'border-red-400 bg-red-50 dark:bg-red-950 dark:border-red-600 focus:ring-2 focus:ring-red-300 dark:focus:ring-red-700' 
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500'
                          }
                        `}
                        disabled
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
                      >
                        {showPasswords.new ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.newPassword}
                      </p>
                    )}
                  </div>

                  {/* Requisitos de contraseña */}
                  {passwordForm.newPassword && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-700">
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                        Requisitos de contraseña:
                      </p>
                      <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
                        <li className={`flex items-center gap-2 ${passwordForm.newPassword.length >= 8 ? 'text-green-600 dark:text-green-400' : ''}`}>
                          <span>✓</span> Mínimo 8 caracteres {passwordForm.newPassword.length >= 8 && '✔'}
                        </li>
                        <li className={`flex items-center gap-2 ${/[A-Z]/.test(passwordForm.newPassword) ? 'text-green-600 dark:text-green-400' : ''}`}>
                          <span>✓</span> Una letra mayúscula {/[A-Z]/.test(passwordForm.newPassword) && '✔'}
                        </li>
                        <li className={`flex items-center gap-2 ${/[a-z]/.test(passwordForm.newPassword) ? 'text-green-600 dark:text-green-400' : ''}`}>
                          <span>✓</span> Una letra minúscula {/[a-z]/.test(passwordForm.newPassword) && '✔'}
                        </li>
                        <li className={`flex items-center gap-2 ${/\d/.test(passwordForm.newPassword) ? 'text-green-600 dark:text-green-400' : ''}`}>
                          <span>✓</span> Un número {/\d/.test(passwordForm.newPassword) && '✔'}
                        </li>
                        <li className={`flex items-center gap-2 ${/@$!%*?&/.test(passwordForm.newPassword) ? 'text-green-600 dark:text-green-400' : ''}`}>
                          <span>✓</span> Un símbolo (@$!%*?&) {/[@$!%*?&]/.test(passwordForm.newPassword) && '✔'}
                        </li>
                      </ul>
                    </div>
                  )}

                  {/* Confirmar contraseña */}
                  <div className="mb-5">
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Confirmar Nueva Contraseña
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Repite tu nueva contraseña"
                        autoComplete="new-password"
                        className={`w-full px-4 py-2.5 rounded-lg border transition duration-200 outline-none
                          ${errors.confirmPassword 
                            ? 'border-red-400 bg-red-50 dark:bg-red-950 dark:border-red-600 focus:ring-2 focus:ring-red-300 dark:focus:ring-red-700' 
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500'
                          }
                        `}
                        disabled
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-4 mt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition duration-200
                      ${loading 
                        ? 'bg-blue-400 dark:bg-blue-600 text-white cursor-not-allowed' 
                        : 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-95'
                      }
                    `}
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Actualizando...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Cambiar Contraseña
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetPasswordForm}
                    disabled={loading}
                    className="py-3 px-6 rounded-lg font-semibold border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Pie de página con información de seguridad */}
          <div className="px-8 sm:px-10 py-6 bg-gray-50 dark:bg-slate-700 border-t border-gray-200 dark:border-slate-600">
            <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Tu información está protegida y encriptada. Nunca compartiremos tus datos.
            </p>
          </div>
        </div>

        {/* Advertencia de seguridad */}
        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-700 rounded-lg">
          <p className="text-sm text-amber-900 dark:text-amber-200">
            <strong>Consejo de seguridad:</strong> Por tu protección, cierra sesión en otros dispositivos después de cambiar tu contraseña.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Usuarios;