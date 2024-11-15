import ora from 'ora';
import boxen from 'boxen';
import chalk from 'chalk';

type LogStep = {
    message: string;
    timestamp: Date;
};

const steps: LogStep[] = [];

export function logStep(message: string) {
    const step = {
        message,
        timestamp: new Date()
    };
    steps.push(step);
    console.log(chalk.blue(`→ ${message}`));
}

export function showSpinner(message: string) {
    return ora({
        text: message,
        color: 'blue',
    }).start();
}

export function displaySummary() {
    const summary = steps
        .map(step => `${chalk.gray(step.timestamp.toLocaleTimeString())} ${step.message}`)
        .join('\n');
    
    console.log(boxen(
        chalk.bold('Authentication Flow Summary:\n\n') + summary,
        {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'blue',
        }
    ));
} 