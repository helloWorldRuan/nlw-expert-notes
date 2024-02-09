import * as Dialog from '@radix-ui/react-dialog';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { X } from 'lucide-react';

interface NoteCardProps {
	note: {
		id: string;
		date: Date;
		content: string;
	};
	onNoteDeleted: (id: string) => void;
}

export function NoteCard({ note, onNoteDeleted }: NoteCardProps) {
	const differenceInDays = formatDistanceToNow(note.date, {
		addSuffix: true,
		locale: ptBR,
	});

	return (
		<Dialog.Root>
			<Dialog.Trigger className="bg-slate-800 rounded-md flex flex-col text-left gap-3 p-5 relative overflow-hidden hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-600 outline-none">
				<span className="text-sm font-medium text-slate-200">{differenceInDays} </span>

				<p className="text-sm text-slate-400">{note.content}</p>

				<div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-950/50 to-slate-950/0 pointer-events-none" />
			</Dialog.Trigger>

			<Dialog.Portal>
				<Dialog.Overlay className="inset-0 bg-black/50 fixed" />
				<Dialog.Content className="max-w-[640px] w-full inset-0 md:inset-auto md:h-[60vh] rounded-md flex flex-col fixed md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-slate-700 outline-none overflow-hidden">
					<Dialog.Close className="bg-slate-800 hover:bg-slate-900/80 absolute right-0 top-0 p-1.5 text-slate-400">
						<X className="size-5" />
					</Dialog.Close>

					<div className="flex flex-1 flex-col gap-3 p-5">
						<span className="text-sm font-medium text-slate-200">{differenceInDays}</span>

						<p className="text-sm text-slate-400">{note.content}</p>
					</div>

					<button
						type="button"
						onClick={() => onNoteDeleted(note.id)}
						className="w-full bg-slate-800 text-slate-300 text-center text-sm py-4 outline-none hover:bg-red-500 hover:text-slate-200 font-medium group cursor-pointer"
					>
						Deseja <span className="text-red-400 group-hover:text-slate-200">apagar essa nota</span>
						?
					</button>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
