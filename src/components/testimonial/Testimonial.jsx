import { useContext } from 'react'
import myContext from '../../context/data/myContext'
import ceo from '../../assets/ceo.jpeg'
import one from '../../assets/one.jpeg'
import two from '../../assets/two.jpeg'

function Testimonial() {
    const context = useContext(myContext);
    const { mode } = context;
    return (
        <div>
            <section style={{marginTop: '8rem'}}>
                <div className=" container mx-auto px-5 py-10">
                    <h1 className=' text-center text-3xl font-bold text-black' style={{ color: mode === 'dark' ? 'white' : '' }}>Testimonial</h1>
                    <h2 className=' text-center text-2xl font-semibold mb-10' style={{ color: mode === 'dark' ? 'white' : '' }}>What our <span className=' text-pink-500'>customers</span> are saying</h2>
                    <div className="flex flex-wrap -m-4">
                        <div className="lg:w-1/3 lg:mb-0 mb-6 p-4">
                            <div className="h-full text-center">
                                <img alt="testimonial" className="w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100" src={ceo} />
                                <p style={{ color: mode === 'dark' ? 'white' : '' }} className="leading-relaxed">
                                    <strong>Shally_Store</strong> is grateful for your continued patronage and support. We appreciate your trust in our products/services and are privileged to serve you.
                                </p>
                                <span className="inline-block h-1 w-10 rounded bg-pink-500 mt-6 mb-4" />
                                <h2 style={{ color: mode === 'dark' ? '#ff4162' : '' }} className="text-gray-900 font-medium title-font tracking-wider text-sm uppercase">Leemah_Hair</h2>
                                <p style={{ color: mode === 'dark' ? 'white' : '' }} className="text-gray-500">CEO</p>
                            </div>
                        </div>

                        <div className="lg:w-1/3 lg:mb-0 mb-6 p-4">
                            <div className="h-full text-center">
                                <img alt="testimonial" className="w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100" src={one} />
                                <p  style={{color: mode === 'dark' ? 'white' : ''}}className="leading-relaxed">
                                Shally Store has completely transformed my shopping experience — quality products, smooth checkout, and fast delivery all in one place.
                                </p>
                                <span className="inline-block h-1 w-10 rounded bg-pink-500 mt-6 mb-4" />
                                <h2 style={{color: mode === 'dark' ? '#ff4162' : ''}} className="text-gray-900 font-medium title-font tracking-wider text-sm uppercase">Cassy</h2>
                                <p style={{color: mode === 'dark' ? 'white' : ''}} className="text-gray-500">Customer</p>
                            </div>
                        </div>
                        <div className="lg:w-1/3 lg:mb-0 p-4">
                            <div className="h-full text-center">
                                <img alt="testimonial" className="w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100" src={two} />
                                <p style={{color: mode === 'dark' ? 'white' : ''}} className="leading-relaxed">
                                    Shopping at Shally Store has been amazing — great prices, top-quality products, and excellent service every time.
                                </p>
                                <span className="inline-block h-1 w-10 rounded bg-pink-500 mt-6 mb-4" />
                                <h2 style={{color: mode === 'dark' ? '#ff4162' : ''}} className="text-gray-900 font-medium title-font tracking-wider text-sm uppercase">Anita</h2>
                                <p  style={{color: mode === 'dark' ? 'white' : ''}}className="text-gray-500">Customer</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Testimonial