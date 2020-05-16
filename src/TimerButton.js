import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';

function CircularDeterminate(props) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    function tick() {
      setProgress((progress) => (progress >= 100 ? 100 : progress + 1/6.5));
    }

    const timer = setInterval(tick, 20);
    return () => {
      clearInterval(timer);
    };
  }, [progress]);

  return (
    <div>
      <CircularProgress variant="determinate" style={{color: '#1976d2'}}value={progress} />
    </div>
  );
}

export default function TimerButton(props) {

  return (
    <div>
      <IconButton onClick={props.onClick}>
        <CircularDeterminate/>
      </IconButton>
    </div>
  );
}
