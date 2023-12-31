'use client';
import Navbar from '@/components/layout/Navbar'
import React, { Fragment } from 'react'
import Image from 'next/image'
import Icon from '@/components/ui/Icon'
import LinkButton from '@/components/ui/LinkButton'
import { Dialog, Transition } from '@headlessui/react'
import Button from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';
import { useCopyToClipboard, useLocalStorage } from 'react-use';
import { getTransaction } from '@/api/getTransaction';
import { useGlobalLoading } from '@/context/GlobalLoader';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserProvider';
import { getUserInfo } from '@/api/getUser';
import { Toaster } from '@/components/ui/toaster';
import EinzahlenButton from '@/components/home/EinzahlenButton';
import AuszahlenButton from '@/components/home/AuszahlenButton';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const [transactions, setTransactions] = React.useState<any>()
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isTooltipOpen, setIsTooltipOpen] = React.useState(false);
    const [state, copyToClipboard] = useCopyToClipboard();

    const { setGlobalLoading } = useGlobalLoading();
    const [token] = useLocalStorage('xtx');
    const route = useRouter();
    const { user, setUser } = useUser();

    let _token = token as string;
    _token = _token ? _token.split('0|')[1] : '';


    // handle redirection 
    const handleRedirection = async() => {
        let userInfo = await getUserInfo(_token); // GET USER INFO AFTER RELOADING THE PAGE                 
        let user = userInfo?.data?.data?.user;


        if(!user || user === undefined){
            // check email verification
            const validationInfo = userInfo?.data?.data?.email_verified;
            const mobileValidation = userInfo?.data?.data?.mobile_verified;

            // console.log({
            //     validationInfo,
            //     mobileValidation
            // });

            if (!validationInfo) {
                route.replace('/verify/email');
            }else if(!mobileValidation){
                route.replace('/verify/mobile');
            } else{
                setUser(user);
                setGlobalLoading(false);
            }


        }else{ 
            // console.log(user.ev);
            if (!user?.ev) {
                route.replace('/verify/email');
                
            } else {
                setUser(user);
                setGlobalLoading(false);
            } 
        }
    }


    // check user already logged in add token to header
    // user has verified email and mobile number
    React.useEffect(() => {
        if (!_token) {
            route.push('/login')
        } else {
            (async () => {
                setGlobalLoading(true);
                handleRedirection();
            })();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    React.useEffect(() => {
        if (user && _token) {
            (async () => {
                const res = await getTransaction(_token);
                let data = res?.data;
                setTransactions(data)
            })();
        }
    }, [_token, user])


    // if copied successfully, then show a tooltip "copied" for 3 seconds   
    React.useEffect(() => {
        let timeout: any;
        if (state.value) {
            timeout = setTimeout(() => {
                setIsTooltipOpen(false);
                clearTimeout(timeout);
            }, 3000);

        }
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTooltipOpen]);

    return (
        <React.Fragment>
            <Navbar /> 

            <header className="relative bg-transparent pt-16 text-white h-[400px] lg:h-[500px] w-screen">
                <Image
                    src="/site/bg.png"
                    alt="bg"
                    width={1920}
                    height={680}
                    quality={70}
                    priority={true}
                    sizes='100vw'
                    className='absolute top-0 left-1/2 -translate-x-1/2 h-full object-fill -z-10'
                />

                <div className="container h-full">
                    <div className='h-full flex flex-col'>

                        {/* header */}
                        <div className="my-auto mt-3 md:mt-16 flex flex-col md:flex-row md:items-center justify-between">
                            <div>
                                <h6 className='mb-2.5 lg:mb-4 block md:inline-block text-sm'>Guthaben Total</h6>
                                <div className="flex flex-col md:flex-row md:items-end gap-4">
                                    <h1 className="text-3xl leading-[32px] md:text-5xl lg:text-[56px] lg:leading-[48px] font-[400]">{Number(user?.balance ?? 0).toFixed(2)} €</h1>
                                    <div className='flex items-center gap-3.5 text-sm tracking-[0.56px]'>
                                        <div className='w-6 h-6 flex items-center justify-center bg-green-500 rounded-[6px] '>
                                            <Icon name="clock" className='w-2 h-2 stroke-black' />
                                        </div>
                                        23.000,00 € heute, 04.08.2023
                                    </div>
                                </div>

                                <span className='block mt-4 text-[rgba(255,255,255,0.30)]'>
                                    Depotzinsen: 5,4% p. a.
                                </span>
                            </div>

                            <div className='flex items-center flex-wrap gap-3'>
                                <EinzahlenButton /> 
                                <AuszahlenButton />
                            </div>

                            {/* <Button
                                variant='primary'
                                onClick={() => setIsModalOpen(true)}
                                className='mt-3 lg:mt-12 text-sm lg:text-[16px] text-primary w-fit pt-2 pb-2 px-3 rounded-md flex items-center'
                            >
                                <Icon name="arrow-right" className='stroke-primary' />
                                <span className='ml-2'> Geld senden</span>
                            </Button>

                            <div className='absolute'>
                                <Transition appear show={isModalOpen} as='div'>
                                    <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
                                        <Transition.Child
                                            as={Fragment}
                                            enter="ease-out duration-300"
                                            enterFrom="opacity-0"
                                            enterTo="opacity-100"
                                            leave="ease-in duration-200"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <div className="fixed inset-0 bg-black bg-opacity-25" />
                                        </Transition.Child>

                                        <div className="fixed inset-0 overflow-y-auto">
                                            <div className="flex min-h-full items-center justify-center p-4 text-center">
                                                <Transition.Child
                                                    as={Fragment}
                                                    enter="ease-out duration-300"
                                                    enterFrom="opacity-0 scale-95"
                                                    enterTo="opacity-100 scale-100"
                                                    leave="ease-in duration-200"
                                                    leaveFrom="opacity-100 scale-100"
                                                    leaveTo="opacity-0 scale-95"
                                                >
                                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                                                        <Dialog.Title
                                                            as="h3"
                                                            className="text-lg leading-6 text-gray-900 font-bold"
                                                        >
                                                            Einzahlen

                                                            <IconButton
                                                                icon="x"
                                                                onClick={() => setIsModalOpen(false)}
                                                                className='px-0 py-0 w-8 h-8 flex items-center justify-center bg-[#F3F3F3] text-[#123857] rounded-full absolute top-3 right-3 hover:bg-primary/20'
                                                                iconclassname='w-4 h-4 stroke-primary'
                                                            />
                                                        </Dialog.Title>
                                                        <div className="mt-2">
                                                            <p className="text-sm text-gray-500">
                                                                Dorem ipsum dolor sit amet, consectetur adipiscing
                                                            </p>
                                                        </div>

                                                        <div className="mt-3 flex flex-col gap-3">
                                                            <div className='px-3 py-3 bg-[#F3F3F3]'>
                                                                <label htmlFor="kontoinhaber" className="block text-sm font-medium text-gray-700">
                                                                    Kontoinhaber
                                                                </label>
                                                                <h5 className='uppercase font-bold text-primary'>Marcel Hadler</h5>
                                                            </div>

                                                            <div className='relative px-3 py-3 bg-[#F3F3F3]'>
                                                                <label htmlFor="kontoinhaber" className="block text-sm font-medium text-gray-700">
                                                                    IBAN
                                                                </label>
                                                                <h5 className='uppercase font-bold text-primary'>
                                                                    DE88 1011 0600 8659 3803 00
                                                                </h5>

                                                                {!isTooltipOpen &&
                                                                    <IconButton
                                                                        onClick={() => {
                                                                            copyToClipboard('DE88 1011 0600 8659 3803 00');
                                                                            setIsTooltipOpen(true);
                                                                        }}
                                                                        icon='copy'
                                                                        className='absolute top-1/2 right-3 -translate-y-1/2 w-fit h-fit p-1 rounded-md bg-transparent group'
                                                                        iconclassname='w-6 h-6 stroke-[#00D296] group-hover:stroke-white'
                                                                    />
                                                                }

                                                                {isTooltipOpen && state.value &&
                                                                    <span>
                                                                        <Icon
                                                                            name="check"
                                                                            className='absolute top-1/2 right-3 -translate-y-1/2 p-0 bg-transparent w-4 h-4 fill-emerald-500'
                                                                        />
                                                                    </span>
                                                                }
                                                            </div>

                                                            <div className='px-3 py-3 bg-[#F3F3F3]'>
                                                                <label htmlFor="BIC" className="block text-sm font-medium text-gray-700">
                                                                    BIC
                                                                </label>
                                                                <h5 className='uppercase font-bold text-primary'>
                                                                    JBKJHJKGXXX
                                                                </h5>
                                                            </div>

                                                            <div className='px-3 py-3 bg-[#F3F3F3]'>
                                                                <label htmlFor="BIC" className="block text-sm font-medium text-gray-700">
                                                                    Einzahlungsbertrag
                                                                </label>
                                                                <h5 className='uppercase font-bold text-primary'>
                                                                    0,00 €
                                                                </h5>
                                                            </div>

                                                            <div className='flex items-center gap-4'>
                                                                <Button className='w-full py-2 bg-[#E8EFF0] hover:bg-[#cbd4d6] rounded-md'>Decline Deposit</Button>
                                                                <Button variant='primary' className='w-full py-2 rounded-md'> Approve deposit </Button>
                                                            </div>
                                                        </div>
                                                    </Dialog.Panel>
                                                </Transition.Child>
                                            </div>
                                        </div>
                                    </Dialog>
                                </Transition>
                            </div> */}
                        </div>
                    </div>
                </div>
            </header>
            <main className=''>
                <section className='-mt-[90px] lg:-mt-[120px] mb-5'>
                    <div className='container'>
                        <div className='flex items-center gap-3 mb-5'>
                            <Icon name="equal-sign" className='w-6 h-6 stroke-primary' />
                            <h6 className='text-white font-medium text-xl'>Zinsdepott</h6>
                        </div>

                        <div className="grid grid-cols-12 gap-3 lg:gap-10">
                            {/* card */}
                            <div className="gap-3 col-span-12 md:col-span-4 flex md:block  bg-white p-3.5 lg:p-10 rounded-lg shadow-mg border">

                                <div>
                                    <Icon name='bar-chart' className='w-14 h-14 lg:w-16 lg:h-16' />
                                </div>
                                <div>
                                    <div className='flex items-center text-xs lg:text-sm  lg:mt-8 lg:mb-8'>
                                        <span className='uppercase mr-2.5 font-medium '>Zinsdepot</span>
                                        <span className='p-1.5 block-inline bg-[#00D296] rounded-[6px] mr-1.5'>
                                            <Icon name="clock" className='w-2 h-2 stroke-white' />
                                        </span>
                                        <span className='font-medium '>{transactions?.interest_deposite} €</span>
                                    </div>

                                    <div className='font-medium text-2xl lg:text-[48px]'>
                                        {Number(transactions?.interest_deposite ?? 0).toFixed(2)} €
                                    </div>
                                </div>
                            </div>

                            {/* card */}
                            <div className="col-span-12 md:col-span-4 flex gap-3 md:block bg-white p-3.5 lg:p-10 rounded-lg shadow-mg border">
                                <div>
                                    <Icon name='percent' className='w-14 h-14 lg:w-16 lg:h-16' />
                                </div>

                                <div>
                                    <div className='flex items-center text-xs md:text-sm lg:mt-8 lg:mb-8'>
                                        <span className='uppercase mr-2.5 font-medium text-sm'>Investmentdepot</span>
                                        <span className='p-1.5 block-inline bg-[#ff3535] rounded-[6px] mr-1.5'>
                                            <Icon name="clock" className='w-2 h-2 stroke-white' />
                                        </span>
                                        <span className='font-medium text-xs whitespace-nowrap'>{Number(transactions?.invesment_deposite ?? 0).toFixed(2)} €</span>
                                    </div>

                                    <div className='font-medium text-2xl lg:text-[48px]'>
                                        {Number(transactions?.invesment_deposite ?? 0).toFixed(2)} €
                                    </div>
                                </div>
                            </div>

                            {/* card */}
                            <div className="col-span-12 md:col-span-4 flex gap-3 md:block bg-white p-3.5 lg:p-10 rounded-lg shadow-mg border">
                                <div>
                                    <Icon name='wallet' className='w-14 h-14 lg:w-16 lg:h-16' />
                                </div>

                                <div>
                                    <div className='flex items-center text-xs md:text-sm lg:mt-8 lg:mb-8'>
                                        <span className='uppercase mr-2.5 font-medium '>Gewinn Total</span>
                                    </div>

                                    <div className='text-2xl font-medium lg:text-[48px]'>
                                        {Number(transactions?.profite_total ?? 0).toFixed(2)} €
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {children}
            </main>
        </React.Fragment >
    )
}

export default DashboardLayout