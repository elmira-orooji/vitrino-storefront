import { ArrowLeft, Check, Headphones, LockKeyhole, PackageCheck, ShieldCheck, Smartphone } from 'lucide-react';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';

import BrandLogo from '~components/brand/BrandLogo';
import { Button, Input } from '~components/ui';

import { isValidIranianMobile, isValidOtp, normalizeIranianMobile, toEnglishDigits } from './helpers';
import './account.css';

type Step = 'phone' | 'code' | 'success';

export const AccountPage: React.FC = () => {
    const [step, setStep] = useState<Step>('phone');
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const phoneRef = useRef<HTMLInputElement>(null);
    const codeRef = useRef<HTMLInputElement>(null);

    const submitPhone = (event: FormEvent): void => {
        event.preventDefault();
        const normalized = normalizeIranianMobile(phone);
        setPhone(normalized);
        if (!isValidIranianMobile(normalized)) {
            setError('شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم داشته باشد.');
            phoneRef.current?.focus();
            return;
        }
        setError('');
        setStep('code');
        requestAnimationFrame(() => codeRef.current?.focus());
    };

    const submitCode = (event: FormEvent): void => {
        event.preventDefault();
        const normalized = toEnglishDigits(code).replace(/\D/g, '').slice(0, 5);
        setCode(normalized);
        if (!isValidOtp(normalized)) {
            setError('کد تأیید پنج‌رقمی را کامل وارد کنید.');
            codeRef.current?.focus();
            return;
        }
        if (normalized !== '12345') {
            setError('کد واردشده درست نیست. برای نسخه نمایشی از ۱۲۳۴۵ استفاده کنید.');
            codeRef.current?.focus();
            return;
        }
        setError('');
        setStep('success');
    };

    return (
        <div className="account-page">
            <section className="account-showcase" aria-label="مزایای حساب کاربری">
                <img
                    className="account-showcase__photo"
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=1200&q=84"
                    alt="خرید آنلاین با موبایل و کارت بانکی"
                    loading="lazy"
                />
                <a href="#home" className="account-showcase__brand"><BrandLogo /></a>
                <div className="account-showcase__content">
                    <span className="account-showcase__eyebrow">خرید ساده‌تر با حساب ویترینو</span>
                    <h1>از انتخاب محصول تا پیگیری بسته، همه‌چیز یک‌جا می‌ماند.</h1>
                    <p>با همان شماره موبایل، سفارش‌ها و نشانی‌های ارسال در دسترس خواهند بود.</p>
                    <ul>
                        <li><PackageCheck aria-hidden="true" /><span><strong>پیگیری سفارش</strong><small>وضعیت آماده‌سازی و ارسال را ببینید.</small></span></li>
                        <li><ShieldCheck aria-hidden="true" /><span><strong>ورود امن و سریع</strong><small>بدون نیاز به ساختن و حفظ‌کردن رمز عبور.</small></span></li>
                        <li><Headphones aria-hidden="true" /><span><strong>دسترسی به پشتیبانی</strong><small>گفت‌وگوهای مربوط به هر سفارش ثبت می‌شوند.</small></span></li>
                    </ul>
                </div>
                <p className="account-showcase__note">اطلاعات این صفحه نمایشی است و به سرور ارسال نمی‌شود.</p>
            </section>

            <section className="account-panel" aria-labelledby="account-title">
                <div className="account-panel__mobile-brand"><BrandLogo /></div>
                {step === 'phone' && (
                    <form className="account-form" onSubmit={submitPhone} noValidate>
                        <span className="account-form__icon"><Smartphone aria-hidden="true" /></span>
                        <p className="account-form__step">ورود یا ساخت حساب</p>
                        <h2 id="account-title">شماره موبایل</h2>
                        <p className="account-form__description">کد ورود برای این شماره نمایش داده می‌شود.</p>
                        <Input
                            ref={phoneRef}
                            label="شماره موبایل"
                            id="account-phone"
                            value={phone}
                            onChange={(event) => { setPhone(event.target.value); setError(''); }}
                            inputMode="tel"
                            autoComplete="tel"
                            placeholder="0912 123 4567"
                            helperText="نمونه: ۰۹۱۲۱۲۳۴۵۶۷"
                            error={error || undefined}
                            startAdornment={<span className="account-field__prefix">+۹۸</span>}
                            className="account-field"
                            dir="ltr"
                            autoFocus
                        />
                        <Button className="account-form__submit" type="submit" endIcon={<ArrowLeft />}>
                            ادامه
                        </Button>
                        <p className="account-form__terms">با ادامه، شرایط استفاده و حریم خصوصی ویترینو پذیرفته می‌شود.</p>
                    </form>
                )}
                {step === 'code' && (
                    <form className="account-form" onSubmit={submitCode} noValidate>
                        <span className="account-form__icon"><LockKeyhole aria-hidden="true" /></span>
                        <Button variant="ghost" size="sm" className="account-form__back" onClick={() => { setStep('phone'); setCode(''); setError(''); }}>
                            ویرایش شماره
                        </Button>
                        <p className="account-form__step">تأیید شماره موبایل</p>
                        <h2 id="account-title">کد تأیید را وارد کنید</h2>
                        <p className="account-form__description">کد پنج‌رقمی برای <bdi>{phone}</bdi> آماده است.</p>
                        <Input
                            ref={codeRef}
                            label="کد تأیید"
                            id="account-code"
                            value={code}
                            onChange={(event) => { setCode(toEnglishDigits(event.target.value).replace(/\D/g, '').slice(0, 5)); setError(''); }}
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={5}
                            placeholder="— — — — —"
                            helperText="کد نسخه نمایشی: ۱۲۳۴۵"
                            error={error || undefined}
                            className="account-code"
                        />
                        <Button className="account-form__submit" type="submit" endIcon={<ArrowLeft />}>
                            تأیید و ورود
                        </Button>
                    </form>
                )}
                {step === 'success' && (
                    <div className="account-form account-success">
                        <span className="account-success__icon"><Check aria-hidden="true" /></span>
                        <p className="account-form__step">ورود موفق</p>
                        <h2 id="account-title">خوش آمدید</h2>
                        <p className="account-form__description">حساب نمایشی با شماره <bdi>{phone}</bdi> آماده شد.</p>
                        <Button className="account-form__submit" onClick={() => { window.location.hash = 'home'; }} endIcon={<ArrowLeft />}>
                            بازگشت به فروشگاه
                        </Button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default AccountPage;
