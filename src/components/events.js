import React, { Component } from 'react'

class Events extends Component {
    render() {
        const styles = {
            container: {
                overflowY: 'scroll',
                flex: 1,
            },
            ul: {
                listStyle: 'none',
            },
            li: {
                marginTop: 13,
                marginBottom: 13,
            },
            eventsName: {
                fontWeight: 'bold',
            },
            events: { fontSize: 15 },
        }
        return(
            <div 
                style={{
                    ...this.props.style,
                    ...styles.container,
                }}
            >
                <ul style={styles.ul}>
                    {this.props.events.map((events, index) => (
                        <li key={index} style={styles.li}>
                            <div>
                                <span style={styles.eventsName}>{events}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}