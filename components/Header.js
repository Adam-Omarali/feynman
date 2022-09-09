import Image from 'next/image'
import styles from '../styles/Home.module.css'


export default function Header(){
    return(
        <div className={styles.header}>
            <Image src="/Everyday.png" alt="Logo" width={75} height={75} />
            {/* <div>Courses</div> */}
            {/* <div>Settings</div> */}
        </div>
    )
}