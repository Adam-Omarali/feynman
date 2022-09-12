import { Button, Switch } from '@nextui-org/react'
import Image from 'next/image'
import Link from 'next/link'
import { useContext } from 'react'
import { appContext } from '../context/appContext'
import styles from '../styles/Home.module.css'
import { useTheme as useNextTheme } from 'next-themes'
import { useTheme } from '@nextui-org/react'


export default function Header(props){

    const { setTheme } = useNextTheme();
    const { isDark, type } = useTheme();

    const context = useContext(appContext)

    return(
        <div className={styles.header}>
            <div className={styles.headerPages}>
                <Link href="/">
                    <a><Image src="/Everyday.png" alt="Logo" width={75} height={75}/></a>
                </Link>
                {/* <div>Courses</div> */}
                {/* <div>Settings</div> */}
            </div>
            <div className={styles.headerPages}>
                {context.user && <p>{context.user.name}</p>}
                <Switch
                    checked={isDark}
                    onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                />
            </div>
        </div>
    )
}