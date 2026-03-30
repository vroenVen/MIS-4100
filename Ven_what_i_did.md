Ven_what_i_did.md

1. https://docs.djangoproject.com/en/6.0/intro/install/
    -  python -m pip install Django
1. https://docs.djangoproject.com/en/6.0/intro/tutorial01/
1. python -m django startproject mysite
1. look at this for hosting react on ghpages
    - https://github.com/gitname/react-gh-pages

1. connected React --> Django
1. Added ai scripts to project
  1. need to add get to react to recive the data



# ideas
send scheduled events to schedual tasks arround
export interface ScheduleEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
}

export interface WeeklySchedule {
  [key: string]: ScheduleEvent[];
}