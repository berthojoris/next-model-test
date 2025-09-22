import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { useAppContext } from '../context/AppContext';
import { db } from '../services/db';
import { SyncStatus, SurveyRegularResponse } from '../types';

const STEPS = 4;
const QUESTIONS_PER_STEP = 5;

const FormInput = ({ error, ...props }: any) => {
    const baseClasses = 'mt-1 block w-full rounded-md bg-white/5 border shadow-sm py-2 px-3';
    const errorClasses = 'border-red-500 focus:border-red-500 focus:ring-red-500';
    const normalClasses = 'border-white/20 focus:border-cyan-500 focus:ring-cyan-500';
    return <input {...props} className={`${baseClasses} ${error ? errorClasses : normalClasses}`} />;
};

const Step = ({ start }: { start: number }) => {
    const { register, formState: { errors } } = useFormContext();
    const stepIndex = Math.ceil(start / QUESTIONS_PER_STEP);
    return (
        <div className="space-y-4 animate-fade-in">
            {[...Array(QUESTIONS_PER_STEP)].map((_, i) => {
                const questionIndex = start + i;
                const fieldName = `step${stepIndex}.q${questionIndex}`;
                const fieldError = errors[`step${stepIndex}`]?.[`q${questionIndex}`];
                return (
                    <div key={i}>
                        <label className="block text-sm font-medium text-gray-300">Question {questionIndex}</label>
                        <FormInput 
                            error={!!fieldError} 
                            {...register(fieldName, { required: 'This field is required.' })} 
                        />
                         {fieldError && <p className="text-red-400 text-xs mt-1">{fieldError.message as string}</p>}
                    </div>
                );
            })}
        </div>
    );
};


const SurveyRegular: React.FC = () => {
    const [step, setStep] = useState(1);
    const methods = useForm({ mode: 'onBlur' });
    const { isOnline } = useAppContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (submitStatus) {
            const timer = setTimeout(() => {
                setSubmitStatus(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [submitStatus]);
    
    const handleNext = async () => {
        const questionStartIndex = 1 + (step - 1) * QUESTIONS_PER_STEP;
        const fieldsToValidate = [...Array(QUESTIONS_PER_STEP)].map((_, i) => `step${step}.q${questionStartIndex + i}`);
        const isValid = await methods.trigger(fieldsToValidate as any);
        if (isValid) {
            setStep(s => s + 1);
        }
    };

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        setSubmitStatus(null);
        
        const surveyResponse: Omit<SurveyRegularResponse, 'id'> = {
            ...data, // This will be structured by react-hook-form
            createdAt: new Date(),
            status: isOnline ? SyncStatus.SYNCED : SyncStatus.PENDING
        };

        try {
            await db.surveyRegularResponses.add(surveyResponse as SurveyRegularResponse);
            const message = isOnline ? 'Survey submitted and synced successfully!' : 'Survey saved locally. Will sync when online.';
            setSubmitStatus({ message, type: 'success' });
            methods.reset();
            setStep(1);
        } catch (error) {
            console.error('Failed to save survey:', error);
            setSubmitStatus({ message: 'Failed to save survey.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2 text-white">Regular Survey</h1>
            <p className="text-lg text-gray-400 mb-6">Step {step} of {STEPS}</p>

            <div className="w-full bg-white/10 rounded-full h-2.5 mb-8">
                <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${(step / STEPS) * 100}%` }}></div>
            </div>

            <div className="glass-card p-8 rounded-2xl shadow-lg border-t-2 border-l-2 border-white/10">
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                        {step === 1 && <Step start={1} />}
                        {step === 2 && <Step start={1 + QUESTIONS_PER_STEP} />}
                        {step === 3 && <Step start={1 + QUESTIONS_PER_STEP * 2} />}
                        {step === 4 && <Step start={1 + QUESTIONS_PER_STEP * 3} />}

                         {submitStatus && (
                            <div className={`p-4 rounded-md text-sm ${submitStatus.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                {submitStatus.message}
                            </div>
                        )}

                        <div className="flex justify-between pt-6">
                            <button type="button" onClick={() => setStep(s => s - 1)} disabled={step === 1} className="py-2 px-4 border border-white/20 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed">
                                Previous
                            </button>
                            {step < STEPS ? (
                                <button type="button" onClick={handleNext} className="btn-gradient py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white">
                                    Next
                                </button>
                            ) : (
                                <button type="submit" disabled={isSubmitting} className="btn-gradient py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white disabled:opacity-50">
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </button>
                            )}
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
};

export default SurveyRegular;