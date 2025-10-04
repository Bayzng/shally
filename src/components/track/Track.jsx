import { useContext } from 'react'
import myContext from '../../context/data/myContext'

function Track() {
    const context = useContext(myContext);
    const { mode } = context;
    return (
        <div>
            <section>
                <div className=" container mx-auto px-5 md:py-5">
                    <div className="flex flex-wrap -m-4 text-center">
                        <div className="p-4 md:w-1/3 sm:w-1/2 w-full">
                            <div className="border-2 hover:shadow-xl hover:shadow-gray-200 border-gray-200 bg-gray-100 shadow-[inset_0_0_2px_rgba(0,0,0,0.6)] px-4 py-6 rounded-lg" style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '', }} >
                                <svg className="text-pink-600 w-12 h-12 mb-3 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>

                                <h2 className="title-font font-medium text-lg text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>Premium Wigs</h2>
                                <p className="leading-relaxed">Premium-quality wigs made from high-quality materials.
                                </p>
                            </div>
                        </div>
                        <div className="p-4 md:w-1/3 sm:w-1/2 w-full">
                            <div className="border-2 hover:shadow-xl hover:shadow-gray-200 border-gray-200 bg-gray-100 shadow-[inset_0_0_2px_rgba(0,0,0,0.6)] px-4 py-6 rounded-lg" style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '', }} >
                            <svg className="text-pink-600 w-12 h-12 mb-3 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5v3a2 2 0 002 2h2a2 2 0 002-2V5m0 0h-6m0 0L9 2m6 3h3a3 3 0 013 3v10a3 3 0 01-3 3H6a3 3 0 01-3-3V8a3 3 0 013-3h3" />
                            </svg>

                                <h2 className="title-font font-medium text-lg text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>Hair Protector</h2>
                                <p className="leading-relaxed">We offer high-quality human hair that is well-protected and securely packaged.
                                </p>
                            </div>
                        </div>

                        <div className="p-4 md:w-1/3 sm:w-1/2 w-full">
                            <div className="border-2 hover:shadow-xl hover:shadow-gray-200 border-gray-200 bg-gray-100 shadow-[inset_0_0_2px_rgba(0,0,0,0.6)] px-4 py-6 rounded-lg" style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '', }} >
                            <svg className="text-pink-600 w-12 h-12 mb-3 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V9a3 3 0 013-3h0a3 3 0 013 3v8m-4-5v3m-3-3h6m-3 0h0M5 13h.01M19 13h.01" />
                            </svg>

                                <h2 className="title-font font-medium text-lg text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>Wigs Polish</h2>
                                <p className="leading-relaxed">Our hair is well-polished and smooth, as we will continue to provide the best quality..
                                </p>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Track