import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'sonner';

interface newNoteCardProps {
	onNoteCreated: (content: string) => void;
}

let speechRecognition: SpeechRecognition | null = null;

export function NewNoteCard({ onNoteCreated }: newNoteCardProps) {
	const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
	const [isRecording, setIsRecording] = useState(false);
	const [content, setContent] = useState('');

	function handleStartEditor() {
		setIsRecording(false);
		setShouldShowOnboarding(false);
	}

	function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
		setContent(event.target.value);

		if (!event.target.value) {
			setShouldShowOnboarding(true);
		}
	}

	function handleSaveNote(event: FormEvent) {
		event.preventDefault();

		if (!content) return;

		onNoteCreated(content);

		setContent('');
		setShouldShowOnboarding(true);

		toast.success('Nota salva com sucesso!');
	}

	function handleStartRecording() {
		const isSpeechRecognitionAPIAvailable =
			'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

		if (!isSpeechRecognitionAPIAvailable) {
			alert('Infelizmente, seu navegador não suporta a API de gravação ☹️');
			return;
		}

		setIsRecording(true);
		setShouldShowOnboarding(false);

		const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

		speechRecognition = new SpeechRecognitionAPI();

		speechRecognition.lang = 'pt-BR';
		speechRecognition.continuous = true;
		speechRecognition.maxAlternatives = 1;
		speechRecognition.interimResults = true;

		speechRecognition.onresult = (event) => {
			const transcription = Array.from(event.results).reduce((text, result) => {
				return text.concat(result[0].transcript);
			}, '');

			setContent(transcription);
		};

		speechRecognition.onerror = (error) => {
			console.log('👽 ~ error:', error);
		};

		speechRecognition.start();
	}

	function handleStopRecording() {
		setIsRecording(false);

		if (speechRecognition) speechRecognition.stop();
	}

	return (
		<Dialog.Root>
			<Dialog.Trigger className="bg-slate-700 rounded-md flex flex-col text-left gap-3 p-5 focus-visible:ring-2 focus-visible:ring-lime-600 outline-none">
				<span className="text-sm font-medium text-slate-200">Adicionar nota</span>

				<p className="text-sm text-slate-400">
					Grave um nota em áudio que sera convetida em texto automaticamente.
				</p>
			</Dialog.Trigger>

			<Dialog.Portal>
				<Dialog.Overlay className="inset-0 bg-black/50 fixed" />
				<Dialog.Content className="max-w-[640px] w-full inset-0 md:inset-auto md:h-[60vh] rounded-md flex flex-col fixed md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-slate-700 outline-none overflow-hidden">
					<Dialog.Close className="bg-slate-800 hover:bg-slate-900/80 absolute right-0 top-0 p-1.5 text-slate-400">
						<X className="size-5" />
					</Dialog.Close>

					<form className="flex flex-1 flex-col">
						<div className="flex flex-1 flex-col gap-3 p-5">
							<span className="text-sm font-medium text-slate-200">Adicionar nota</span>

							{shouldShowOnboarding ? (
								<p className="text-sm text-slate-400">
									Comece{' '}
									<button
										type="button"
										onClick={handleStartRecording}
										className="text-lime-400 hover:underline"
									>
										gravando uma nota
									</button>{' '}
									em áudio ou se preferir{' '}
									<button
										type="button"
										onClick={handleStartEditor}
										className="text-lime-400 hover:underline"
									>
										utilize apenas texto
									</button>
									.
								</p>
							) : (
								<textarea
									autoFocus
									className="text-sm text-slate-400 bg-transparent resize-none flex-1 outline-none"
									onChange={handleContentChanged}
									value={content}
								/>
							)}
						</div>

						{isRecording ? (
							<button
								type="button"
								onClick={handleStopRecording}
								className="w-full flex justify-center items-center gap-2 bg-slate-900 text-slate-300 text-center text-sm py-4 outline-none hover:text-slate-100 font-medium cursor-pointer"
							>
								<div className="size-3 rounded-full bg-red-400 animate-pulse" />
								Gravando! (clique p/ interromper)
							</button>
						) : (
							<button
								type="button"
								onClick={handleSaveNote}
								className="w-full bg-lime-400 text-lime-950 text-center text-sm py-4 outline-none hover:bg-lime-500 font-medium cursor-pointer"
							>
								Salvar nota
							</button>
						)}
					</form>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
