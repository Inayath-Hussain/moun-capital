import { useState } from 'react';

const SideBar = () => {
    const [selectedSection, setSelectedSection] = useState(-1)

    return (
        <div className='flex flex-col justify-between border-r-2 border-solid border-border border-y-0 border-l-0 col-start-1 col-end-2 row-start-2 row-end-4'>

            <div>

                <div className="flex justify-between flex-row mb-7 mt-8 ml-6 mr-8">
                    <div className='flex flex-row'>
                        <div className="font-semibold flex justify-center items-center mr-2 h-7 w-7 text-base rounded-half bg-primary text-white">N</div>
                        <p className="font-semibold text-2xl">Name</p>
                    </div>

                    <img src="/close-icon.svg" alt="close" className='cursor-pointer' />
                </div>

                <div className='flex flex-col ml-2'>
                    <div onClick={() => setSelectedSection(0)} className={`py-2 pl-4 mr-6 cursor-pointer rounded-xl flex flex-row mb-7 ${selectedSection === 0 ? 'text-white bg-section' : ''}`}>
                        <img src="/home.svg" alt="" className='mr-5' />
                        <div className='font-semibold text-sm'>Home</div>
                    </div>

                    <div onClick={() => setSelectedSection(1)} className={`py-2 pl-4 mr-6 cursor-pointer rounded-xl flex flex-row mb-7 ${selectedSection === 1 ? 'text-white bg-section' : ''}`}>
                        <img src="/section1.svg" alt="" className='mr-5' />
                        <div className='font-semibold text-sm'>Section 1</div>
                    </div>

                    <div onClick={() => setSelectedSection(2)} className={`py-2 pl-4 mr-6 cursor-pointer rounded-xl flex flex-row mb-7 ${selectedSection === 2 ? 'text-white bg-section' : ''}`}>
                        <img src="/section2.svg" alt="" className='mr-5' />
                        <div className='font-semibold text-sm'>Section 2</div>
                    </div>
                    <div onClick={() => setSelectedSection(3)} className={`py-2 pl-4 mr-6 cursor-pointer rounded-xl flex flex-row mb-7 ${selectedSection === 3 ? 'text-white bg-section' : ''}`}>
                        <img src="/section8.svg" alt="" className='mr-5' />
                        <div className='font-semibold text-sm'>Section 8</div>
                    </div>
                </div>
            </div>


            <footer className='pb-6 ml-5'>

                <div className='flex flex-row justify-start mb-4'>
                    <div className='w-24 h-8 rounded-xl bg-section flex flex-row justify-center items-center cursor-pointer'>
                        <div className='font-semibold pl-[0.9px] rounded-half flex justify-center items-center w-4 pt-[0.78px] h-4 ml-4  bg-primary text-white text-xs'>N</div>
                        <div className='font-semibold mr-4 text-sm ml-1 text-white'>$0.90</div>
                    </div>

                    <div className='ml-1 w-24 h-8 rounded-xl bg-secondary flex justify-center items-center cursor-pointer'>
                        <div className='font-semibold text-sm ml-1 text-primary'>Buy $XYZ</div>
                    </div>

                </div>

                <div className='flex flex-row'>
                    <img src="/web.svg" alt="" className='mr-3 cursor-pointer' />

                    <div className='p-1 rounded-xl w-14 h-6 bg-section flex flex-row justify-around items-center'>
                        <img src="/darkmode.svg" alt="" className='cursor-pointer' />
                        <img src="/circle.svg" alt="" className='mt-1 h-5 w-5 cursor-pointer' />
                    </div>
                </div>

            </footer>

        </div>
    );
}

export default SideBar;