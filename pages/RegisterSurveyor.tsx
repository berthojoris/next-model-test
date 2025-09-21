
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAppContext } from '../context/AppContext';
import { db } from '../services/db';
import { Region, SyncStatus, Surveyor } from '../types';

const FormInput = (props: any) => (
    <input {...props} className="mt-1 block w-full rounded-md bg-white/5 border-white/20 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 py-2 px-3" />
);

const FormSelect = (props: any) => (
     <select {...props} className="mt-1 block w-full rounded-md bg-gray-800/80 border-white/20 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 py-2 px-3">
        {props.children}
    </select>
);

const RegisterSurveyor: React.FC = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Surveyor, 'id' | 'createdAt' | 'status'>>();
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

    const onSubmit = async (data: Omit<Surveyor, 'id' | 'createdAt' | 'status'>) => {
        setIsSubmitting(true);
        setSubmitStatus(null);
        
        const newSurveyor: Omit<Surveyor, 'id'> = {
            ...data,
            createdAt: new Date(),
            status: isOnline ? SyncStatus.SYNCED : SyncStatus.PENDING,
        };

        try {
            await db.surveyors.add(newSurveyor as Surveyor);
            const message = isOnline 
                ? 'Surveyor registered and synced successfully!' 
                : 'Surveyor saved locally. Will sync when online.';
            setSubmitStatus({ message, type: 'success' });
            reset();
        } catch (error) {
            console.error('Failed to save surveyor:', error);
            setSubmitStatus({ message: 'Failed to save surveyor.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-white">Register Surveyor</h1>
            <div className="glass-card p-8 rounded-2xl shadow-lg border-t-2 border-l-2 border-white/10">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Full Name</label>
                            <FormInput {...register('fullName', { required: 'Full name is required' })} />
                            {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Email</label>
                            <FormInput type="email" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })} />
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Phone Number</label>
                            <FormInput type="tel" {...register('phoneNumber', { required: 'Phone number is required' })} />
                            {errors.phoneNumber && <p className="text-red-400 text-xs mt-1">{errors.phoneNumber.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Region</label>
                            <FormSelect {...register('region', { required: 'Region is required' })}>
                                {Object.values(Region).map(r => <option key={r} value={r} className="bg-gray-800">{r}</option>)}
                            </FormSelect>
                            {errors.region && <p className="text-red-400 text-xs mt-1">{errors.region.message}</p>}
                        </div>
                         <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300">ID Number</label>
                            <FormInput {...register('idNumber', { required: 'ID number is required' })} />
                            {errors.idNumber && <p className="text-red-400 text-xs mt-1">{errors.idNumber.message}</p>}
                        </div>
                    </div>
                    
                    {submitStatus && (
                        <div className={`p-4 rounded-md text-sm ${submitStatus.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {submitStatus.message}
                        </div>
                    )}
                    
                    <div className="flex justify-end pt-4">
                        <button type="submit" disabled={isSubmitting} className="btn-gradient inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                            {isSubmitting ? 'Submitting...' : 'Register'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterSurveyor;
