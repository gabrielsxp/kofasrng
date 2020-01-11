import React from 'react';
import Typography from '@material-ui/core/Typography'

export default function Ads(){
    return <div style={{backgroundColor: '#fff', height: '200px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div style={{margin: '20px', width: '500px', height: '120px', border: '3px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Typography variant="h5">ADS</Typography>
        </div>
    </div>
}