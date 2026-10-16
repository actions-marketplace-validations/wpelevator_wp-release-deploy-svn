import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createSvnRunner } from '@wpelevator/wp-release';
import type { SvnRunner } from '@wpelevator/wp-release';

/**
 * Run a command without a shell. Rejects when it fails or doesn't exist.
 */
export type CommandRunner = (
	command: string,
	args: string[]
) => Promise< void >;

export interface InstallSvnInput {
	/** Command runner, execFile() by default. */
	run?: CommandRunner;
	/** Operating system, process.platform by default. */
	platform?: NodeJS.Platform;
	/** Whether the process runs as root, so that sudo isn't needed. */
	isRoot?: boolean;
	/** Log a message. */
	log?: ( message: string ) => void;
}

const execFileAsync = promisify( execFile );

const runCommand: CommandRunner = async ( command, args ) => {
	await execFileAsync( command, args );
};

/**
 * Install the Subversion client with apt-get when svn isn't available.
 * GitHub-hosted Ubuntu runners don't include it but allow sudo without a
 * password. Other systems need it installed before the action runs.
 *
 * @param  input Command runner, platform and logger.
 * @throws {Error} If svn is missing and can't be installed.
 */
export async function installSvn(
	input: InstallSvnInput = {}
): Promise< void > {
	const {
		run = runCommand,
		platform = process.platform,
		isRoot = 0 === process.getuid?.(),
		log = () => undefined,
	} = input;
	const hasSvn = await run( 'svn', [ '--version', '--quiet' ] ).then(
		() => true,
		() => false
	);

	if ( ! hasSvn && 'linux' !== platform ) {
		throw new Error(
			`The svn command isn't installed. Install Subversion on the ${ platform } runner before this action, or use an ubuntu runner where the action installs it.`
		);
	}

	if ( ! hasSvn ) {
		const [ command = 'apt-get', ...prefix ] = isRoot
			? [ 'apt-get' ]
			: [ 'sudo', 'apt-get' ];
		const apt = ( args: string[] ) =>
			run( command, [ ...prefix, ...args ] );

		log( 'Installing Subversion with apt-get.' );
		await apt( [ 'update', '--quiet' ] );
		await apt( [
			'install',
			'--yes',
			'--quiet',
			'--no-install-recommends',
			'subversion',
		] );
	}
}

/**
 * Install SVN on the first command, once for all targets in the action.
 * Plans and deployments without writes never call this runner.
 *
 * @param input  Installation dependencies and logger.
 * @param runner SVN command runner.
 * @return Runner that checks SVN before executing its first command.
 */
export function createActionSvnRunner(
	input: InstallSvnInput = {},
	runner: SvnRunner = createSvnRunner()
): SvnRunner {
	let ready: Promise< void > | undefined;

	return async ( command ) => {
		ready ??= installSvn( input );
		await ready;

		return runner( command );
	};
}
