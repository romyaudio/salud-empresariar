'use client';

import { useState } from 'react';
import { useAccountDeletion } from '@/hooks/useAccountDeletion';
import { useToast } from '@/hooks/useToast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface DeleteAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type DeleteStep = 'questionnaire' | 'confirmation' | 'final-confirmation';

interface QuestionnaireData {
  reason: string;
  feedback: string;
  alternativeConsidered: boolean;
}

export function DeleteAccountDialog({ isOpen, onClose }: DeleteAccountDialogProps) {
  const { deleteAccount, isDeleting } = useAccountDeletion();
  const { addToast } = useToast();
  
  const [currentStep, setCurrentStep] = useState<DeleteStep>('questionnaire');
  const [confirmationText, setConfirmationText] = useState('');
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData>({
    reason: '',
    feedback: '',
    alternativeConsidered: false
  });

  const reasons = [
    'No uso la aplicación con frecuencia',
    'Encontré una alternativa mejor',
    'La aplicación no cumple mis expectativas',
    'Problemas de privacidad o seguridad',
    'Demasiado complicada de usar',
    'No necesito más un gestor financiero',
    'Otro motivo'
  ];

  const handleQuestionnaireSubmit = () => {
    if (!questionnaireData.reason) {
      addToast('Por favor selecciona un motivo', 'error');
      return;
    }
    setCurrentStep('confirmation');
  };

  const handleConfirmationNext = () => {
    setCurrentStep('final-confirmation');
  };

  const handleDeleteAccount = async () => {
    if (confirmationText.toLowerCase() !== 'eliminar') {
      addToast('Debes escribir "eliminar" para confirmar', 'error');
      return;
    }

    try {
      await deleteAccount(questionnaireData);
      onClose();
    } catch (error) {
      // Error handling is done in the hook
      console.error('Delete account failed:', error);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setCurrentStep('questionnaire');
      setConfirmationText('');
      setQuestionnaireData({
        reason: '',
        feedback: '',
        alternativeConsidered: false
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {currentStep === 'questionnaire' && 'Eliminar Cuenta'}
            {currentStep === 'confirmation' && 'Confirmar Eliminación'}
            {currentStep === 'final-confirmation' && 'Confirmación Final'}
          </h2>
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Questionnaire Step */}
          {currentStep === 'questionnaire' && (
            <div className="space-y-6">
              <div>
                <p className="text-gray-600 mb-4">
                  Lamentamos que quieras eliminar tu cuenta. Nos ayudarías mucho si nos dijeras por qué.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  ¿Cuál es el motivo principal? *
                </label>
                <div className="space-y-2">
                  {reasons.map((reason) => (
                    <label key={reason} className="flex items-center">
                      <input
                        type="radio"
                        name="reason"
                        value={reason}
                        checked={questionnaireData.reason === reason}
                        onChange={(e) => setQuestionnaireData(prev => ({ ...prev, reason: e.target.value }))}
                        className="mr-3 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Hay algo que podríamos mejorar? (Opcional)
                </label>
                <textarea
                  value={questionnaireData.feedback}
                  onChange={(e) => setQuestionnaireData(prev => ({ ...prev, feedback: e.target.value }))}
                  placeholder="Comparte tus comentarios..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={questionnaireData.alternativeConsidered}
                    onChange={(e) => setQuestionnaireData(prev => ({ ...prev, alternativeConsidered: e.target.checked }))}
                    className="mr-3 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">
                    He considerado otras opciones antes de eliminar mi cuenta
                  </span>
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="secondary"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleQuestionnaireSubmit}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {/* Confirmation Step */}
          {currentStep === 'confirmation' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      ¿Estás seguro de que quieres eliminar tu cuenta?
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>Esta acción no se puede deshacer.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Al eliminar tu cuenta se perderán permanentemente:
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Todas tus transacciones e historial financiero
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Tu información personal y empresarial
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Categorías personalizadas y presupuestos
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Tu cuenta de usuario y acceso a la aplicación
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      ¿Consideraste estas alternativas?
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Exportar tus datos antes de eliminar la cuenta</li>
                        <li>Contactar soporte para resolver problemas</li>
                        <li>Simplemente dejar de usar la aplicación sin eliminarla</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="secondary"
                  onClick={() => setCurrentStep('questionnaire')}
                  className="flex-1"
                >
                  Volver
                </Button>
                <Button
                  onClick={handleConfirmationNext}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Sí, eliminar cuenta
                </Button>
              </div>
            </div>
          )}

          {/* Final Confirmation Step */}
          {currentStep === 'final-confirmation' && (
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      ⚠️ ÚLTIMA ADVERTENCIA
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>
                        Esta acción eliminará permanentemente tu cuenta y todos tus datos. 
                        <strong> No podrás recuperar esta información.</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-gray-700 mb-4">
                  Para confirmar que realmente quieres eliminar tu cuenta, escribe la palabra{' '}
                  <strong className="text-red-600">&quot;eliminar&quot;</strong> en el campo de abajo:
                </p>
                
                <Input
                  label="Confirmación"
                  type="text"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder="Escribe: eliminar"
                  className={confirmationText.toLowerCase() === 'eliminar' ? 'border-green-500' : ''}
                />
                
                {confirmationText && confirmationText.toLowerCase() !== 'eliminar' && (
                  <p className="text-red-600 text-sm mt-1">
                    Debes escribir exactamente &quot;eliminar&quot;
                  </p>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="secondary"
                  onClick={() => setCurrentStep('confirmation')}
                  disabled={isDeleting}
                  className="flex-1"
                >
                  Volver
                </Button>
                <Button
                  onClick={handleDeleteAccount}
                  disabled={confirmationText.toLowerCase() !== 'eliminar' || isDeleting}
                  loading={isDeleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400"
                >
                  {isDeleting ? 'Eliminando...' : 'ELIMINAR CUENTA'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}