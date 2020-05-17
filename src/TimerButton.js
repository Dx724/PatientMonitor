import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';

function CircularDeterminate(props) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    function tick() {
      setProgress((progress) => (progress >= 100 ? 100 : progress + 1 / 6.5));
    }

    const timer = setInterval(tick, 20);
    return () => {
      clearInterval(timer);
    };
  }, [progress]);

  return (
    <CircularProgress variant="determinate" style={{ color: '#1976d2' }} value={progress} size={35}/>
  );
}

export default function TimerButton(props) {
  return (
    <Tooltip title={"Unmute all"} arrow>
      <IconButton onClick={props.onClick} size='small'>
        <CircularDeterminate />
      </IconButton>
    </Tooltip>
  );
}
