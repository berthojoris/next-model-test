
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { useAppContext } from '../context/AppContext';
import { db } from '../services/db';
import { SyncStatus, SurveyEventResponse } from '../types';

const STEPS = 3;

const FormInput = (props: any) => (
    <input {...props} className="mt-1 block w-full rounded-md bg-white/5 border-white/20 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 py-2 px-3" />
);

const EventDetails = () => {
    const { register } = useFormContext();
    return (
        <div className="space-y-4 animate-fade-in">
             <div>
                <label className="block text-sm font-medium text-gray-300">Event Date</label>
                <FormInput type="date" {...register('eventDate')} />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-300">Location</label>
                <FormInput {...register('location')} />
             </div>
        </div>
    )
};

const StepQuestions = ({ start }: {start: number}) => {
    const { register } = useFormContext();
    return (
        <div className="space-y-4 animate-fade-in">
            {[...Array(5)].map((_, i) => (
                <div key={i}>
                    <label className="block text-sm font-medium text-gray-300">Question {start + i}</label>
                    <FormInput {...register(`step${Math.ceil(start/5)}.q${start+i}`)} />
                </div>
            ))}
        </div>
    )
}

const SurveyEvent: React.FC = () => {
    const [step, setStep] = useState(1);
    const methods = useForm();
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

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        setSubmitStatus(null);
        
        const surveyResponse: Omit<SurveyEventResponse, 'id'> = {
            ...data,
            createdAt: new Date(),
            status: isOnline ? SyncStatus.SYNCED : SyncStatus.PENDING
        };

        try {
            await db.surveyEventResponses.add(surveyResponse as SurveyEventResponse);
            const message = isOnline ? 'Event survey submitted and synced!' : 'Event survey saved locally. Will sync when online.';
            setSubmitStatus({ message, type: 'success' });
            methods.reset();
            setStep(1);
        } catch (error) {
            console.error('Failed to save event survey:', error);
            setSubmitStatus({ message: 'Failed to save event survey.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2 text-white">Event Survey</h1>
            <p className="text-lg text-gray-400 mb-6">Step {step} of {STEPS}</p>

            <div className="w-full bg-white/10 rounded-full h-2.5 mb-8">
                 <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${(step / STEPS) * 100}%` }}></div>
            </div>
            
            <div className="glass-card p-8 rounded-2xl shadow-lg border-t-2 border-l-2 border-white/10">
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                        {step === 1 && <EventDetails />}
                        {step === 2 && <StepQuestions start={1} />}
                        {step === 3 && <StepQuestions start={6} />}

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
                                <button type="button" onClick={() => setStep(s => s + 1)} className="btn-gradient py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white">
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

export default SurveyEvent;
