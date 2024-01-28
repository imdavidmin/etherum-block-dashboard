'use client'
import React, { ReactElement } from 'react'

type IconButtonProps = { icon: ReactElement; label: string }
export function IconButton(props: Readonly<IconButtonProps>) {
    return (
        <button className="icon-button">
            {props.icon}
            <span>{props.label}</span>
        </button>
    )
}
