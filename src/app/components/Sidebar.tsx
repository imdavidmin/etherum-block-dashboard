'use client'
import { ICONS } from './icons'
import React from 'react'
import { IconButton } from './IconButton'

export function Sidebar() {
    const USER_BUTTONS: Array<string> = ['dashboard', 'projects', 'explorer']
    const APP_BUTTONS: Array<string> = ['settings', 'logout']
    return (
        <div className="sidebar grid">
            <button className="home-button">{ICONS.infura}</button>
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
