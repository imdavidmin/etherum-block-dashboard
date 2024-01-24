'use client'
import { ICONS } from './components/icons'
import './page.scss'

import React, { ReactElement } from 'react'

export default function Page() {
    return (
        <>
            <Sidebar /> <Dashboard />
        </>
    )
}
function Sidebar() {
    const USER_BUTTONS: Array<string> = ['dashboard', 'projects', 'explorer']
    const APP_BUTTONS: Array<string> = ['settings', 'logout']
    return (
        <div className="sidebar">
            <button className="home-button">
                <svg
                    width="48"
                    height="41"
                    viewBox="0 0 48 41"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M1.39872 0V6.1968L16.201 4.67136H21.6643V14.7014L12.4646 17.5152L0 20.521L1.85088 26.5795L13.7952 21.9888L21.6643 19.584V36.048H16.201L1.39872 34.5216V40.7184H46.6013V34.5216L31.799 36.048H26.3357V19.584L34.1654 21.9763L46.1501 26.5795L48 20.521L35.569 17.5238L26.3357 14.7014V4.67136H31.799L46.6013 6.1968V0H1.39872Z"
                        fill="white"
                    />
                </svg>
            </button>
            <div>{getButtons(USER_BUTTONS)}</div>
            <div>{getButtons(APP_BUTTONS)}</div>
        </div>
    )

    function getButtons(labels: Array<string>) {
        return labels.map((buttonLabel) => (
            <IconButton
                key={buttonLabel}
                icon={ICONS[buttonLabel] ?? <span>?</span>}
                label={buttonLabel}
            />
        ))
    }
}

function Dashboard() {
    return <div></div>
}

type IconButtonProps = { icon: ReactElement; label: string }
function IconButton(props: IconButtonProps) {
    return (
        <button className="icon-button">
            {props.icon}
            <span>{props.label.toUpperCase()}</span>
        </button>
    )
}
