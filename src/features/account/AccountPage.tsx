import { ArrowLeft, Check, Headphones, Loader2, LogIn, PackageCheck, ShieldCheck, UserPlus } from 'lucide-react';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';

import BrandLogo from '~components/brand/BrandLogo';
import { Button, Input } from '~components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/lib/api';

import './account.css';

type Step = 'login' | 'register';

export const AccountPage: React.FC = () => {
    const { login, register, isAuthenticated, user } = useAuth();
    const [step, setStep] = useState<Step>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    if (isAuthenticated && user) {
        return (
            <div className="account-page">
                <section className="account-panel">
                    <div className="account-form account-success">
                        <span className="account-success__icon"><Check aria-hidden="true" /></span>
                        <p className="account-form__step">ورود موفق</p>
                        <h2 id="account-title">خوش آمدید، {user.name}</h2>
                        <p className="account-form__description">ایمیل: <bdi>{user.email}</bdi></p>
                        <Button className="account-form__submit" onClick={() => { window.location.hash = 'home'; }} endIcon={<ArrowLeft />}>
                            بازگشت به فروشگاه
                        </Button>
                    </div>
                </section>
            </div>
        );
    }

    const handleLogin = async (event: FormEvent): Promise<void> => {
        event.preventDefault();
        setError('');
        if (!email || !password) { setError('لطفاً ایمیل و رمز عبور را وارد کنید.'); return; }
        setIsLoading(true);
        try { await login(email, password); } catch (err) { setError(err instanceof ApiError ? err.message : 'خطا در ورود.'); } finally { setIsLoading(false); }
    };

    const handleRegister = async (event: FormEvent): Promise<void> => {
        event.preventDefault();
        setError('');
        if (!name || !email || !password) { setError('لطفاً تمام فیلدها را پر کنید.'); return; }
        if (password.length < 6) { setError('رمز عبور باید حداقل ۶ کاراکتر باشد.'); return; }
        setIsLoading(true);
        try { await register(name, email, password); } catch (err) { setError(err instanceof ApiError ? err.message : 'خطا در ثبت‌نام.'); } finally { setIsLoading(false); }
    };

    return (
        <div className="account-page">
            <section className="account-showcase" aria-label="مزایای حساب کاربری">
                <img className="account-showcase__photo" src="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=1200&q=84" alt="خرید آنلاین" loading="lazy" />
                <a href="#home" className="account-showcase__brand"><BrandLogo /></a>
                <div className="account-showcase__content">
                    <span className="account-showcase__eyebrow">خرید ساده‌تر با حساب ویترینو</span>
                    <h1>از انتخاب محصول تا پیگیری بسته، همه‌چیز یک‌جا می‌ماند.</h1>
                    <ul>
                        <li><PackageCheck aria-hidden="true" /><span><strong>پیگیری سفارش</strong></span></li>
                        <li><ShieldCheck aria-hidden="true" /><span><strong>ورود امن</strong></span></li>
                        <li><Headphones aria-hidden="true" /><span><strong>پشتیبانی</strong></span></li>
                    </ul>
                </div>
            </section>
            <section className="account-panel" aria-labelledby="account-title">
                {step === 'login' && (
                    <form className="account-form" onSubmit={handleLogin} noValidate>
                        <span className="account-form__icon"><LogIn aria-hidden="true" /></span>
                        <p className="account-form__step">ورود به حساب</p>
                        <h2 id="account-title">وارد حساب خود شوید</h2>
                        <Input ref={emailRef} label="ایمیل" id="account-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} autoComplete="email" placeholder="example@email.com" error={error || undefined} className="account-field" dir="ltr" autoFocus />
                        <Input ref={passwordRef} label="رمز عبور" id="account-password" type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} autoComplete="current-password" placeholder="••••••••" className="account-field" dir="ltr" />
                        <Button className="account-form__submit" type="submit" endIcon={isLoading ? <Loader2 className="animate-spin" size={18} /> : <ArrowLeft />} disabled={isLoading}>{isLoading ? 'در حال ورود...' : 'ورود'}</Button>
                        <p className="account-form__terms">حساب ندارید؟ <button type="button" onClick={() => { setStep('register'); setError(''); }} style={{ background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}>ثبت‌نام کنید</button></p>
                    </form>
                )}
                {step === 'register' && (
                    <form className="account-form" onSubmit={handleRegister} noValidate>
                        <span className="account-form__icon"><UserPlus aria-hidden="true" /></span>
                        <Button variant="ghost" size="sm" className="account-form__back" onClick={() => { setStep('login'); setError(''); }}>بازگشت به ورود</Button>
                        <p className="account-form__step">ثبت‌نام</p>
                        <h2 id="account-title">حساب جدید بسازید</h2>
                        <Input label="نام کامل" id="account-name" value={name} onChange={(e) => { setName(e.target.value); setError(''); }} autoComplete="name" placeholder="نام و نام خانوادگی" error={error || undefined} className="account-field" autoFocus />
                        <Input label="ایمیل" id="account-reg-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} autoComplete="email" placeholder="example@email.com" className="account-field" dir="ltr" />
                        <Input ref={passwordRef} label="رمز عبور" id="account-reg-password" type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} autoComplete="new-password" placeholder="حداقل ۶ کاراکتر" helperText="رمز عبور باید حداقل ۶ کاراکتر باشد." className="account-field" dir="ltr" />
                        <Button className="account-form__submit" type="submit" endIcon={isLoading ? <Loader2 className="animate-spin" size={18} /> : <ArrowLeft />} disabled={isLoading}>{isLoading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}</Button>
                        <p className="account-form__terms">با ثبت‌نام، شرایط استفاده و حریم خصوصی پذیرفته می‌شود.</p>
                    </form>
                )}
            </section>
        </div>
    );
};

export default AccountPage;
