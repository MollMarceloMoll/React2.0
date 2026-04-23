import React, { useState } from 'react';
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

  // Validaciones
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    // Mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un símbolo
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateEmailForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!emailForm.newEmail.trim()) {
      newErrors.newEmail = 'El correo electrónico es requerido';
    } else if (!validateEmail(emailForm.newEmail)) {
      newErrors.newEmail = 'Ingresa un correo electrónico válido';
    } else if (emailForm.newEmail === 'usuario@ejemplo.com') {
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
    const response = await fetch('http://localhost:4000/api/usuarios/change-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': localStorage.getItem('userId') || ''
      },
      body: JSON.stringify({
        newEmail: emailForm.newEmail,
        currentPassword: emailForm.currentPassword
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      setErrors({ submit: errorData.error });
      return;
    }

    setSuccess({
      type: 'email',
      message: 'Correo electrónico actualizado exitosamente'
    });
    
    setEmailForm({ newEmail: '', currentPassword: '' });
    
    setTimeout(() => {
      setSuccess({ type: null, message: '' });
    }, 4000);
  } catch (error) {
    setErrors({ submit: 'Error al actualizar el correo. Intenta de nuevo.' });
  } finally {
    setLoading(false);
  }
};

const handlePasswordSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validatePasswordForm()) return;

  setLoading(true);
  try {
    const response = await fetch('http://localhost:4000/api/usuarios/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': localStorage.getItem('userId') || ''
      },
      body: JSON.stringify({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      setErrors({ submit: errorData.error });
      return;
    }

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
  } catch (error) {
    setErrors({ submit: 'Error al actualizar la contraseña. Intenta de nuevo.' });
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

  // Componente de campo de entrada reutilizable
  const FormField = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    showToggle = false,
    showPassword = false,
    onTogglePassword = () => {}
  }: {
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    placeholder?: string;
    showToggle?: boolean;
    showPassword?: boolean;
    onTogglePassword?: () => void;
  }) => (
    <div className="mb-5">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={showToggle && showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 rounded-lg border transition duration-200 outline-none
            ${error 
              ? 'border-red-400 bg-red-50 dark:bg-red-950 dark:border-red-600 focus:ring-2 focus:ring-red-300 dark:focus:ring-red-700' 
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500'
            }
          `}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );

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

            {/* Formulario de correo electrónico */}
            {activeTab === 'profile' && (
              <form onSubmit={handleEmailSubmit}>
                <div className="space-y-6">
                  {/* Correo actual */}
                  <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Correo electrónico actual
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      usuario@ejemplo.com
                    </p>
                  </div>

                  {/* Nuevo correo */}
                  <FormField
                    label="Nuevo Correo Electrónico"
                    name="newEmail"
                    type="email"
                    value={emailForm.newEmail}
                    onChange={handleEmailChange}
                    error={errors.newEmail}
                    placeholder="ejemplo@correo.com"
                  />

                  {/* Contraseña actual */}
                  <FormField
                    label="Contraseña Actual (confirmación)"
                    name="currentPassword"
                    type="password"
                    value={emailForm.currentPassword}
                    onChange={handleEmailChange}
                    error={errors.currentPassword}
                    placeholder="Ingresa tu contraseña"
                    showToggle={true}
                    showPassword={showPasswords.current}
                    onTogglePassword={() => 
                      setShowPasswords(prev => ({ ...prev, current: !prev.current }))
                    }
                  />
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
                  <FormField
                    label="Contraseña Actual"
                    name="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    error={errors.currentPassword}
                    placeholder="Ingresa tu contraseña actual"
                    showToggle={true}
                    showPassword={showPasswords.current}
                    onTogglePassword={() => 
                      setShowPasswords(prev => ({ ...prev, current: !prev.current }))
                    }
                  />

                  {/* Nueva contraseña */}
                  <FormField
                    label="Nueva Contraseña"
                    name="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    error={errors.newPassword}
                    placeholder="Mínimo 8 caracteres"
                    showToggle={true}
                    showPassword={showPasswords.new}
                    onTogglePassword={() => 
                      setShowPasswords(prev => ({ ...prev, new: !prev.new }))
                    }
                  />

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
                          <span>✓</span> Un símbolo (@$!%*?&) {/[@$!%*?&]/.test()(passwordForm.newPassword) && '✔'}
                        </li>
                      </ul>
                    </div>
                  )}

                  {/* Confirmar contraseña */}
                  <FormField
                    label="Confirmar Nueva Contraseña"
                    name="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    error={errors.confirmPassword}
                    placeholder="Repite tu nueva contraseña"
                    showToggle={true}
                    showPassword={showPasswords.confirm}
                    onTogglePassword={() => 
                      setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))
                    }
                  />
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